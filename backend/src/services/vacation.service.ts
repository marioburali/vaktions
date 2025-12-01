import { Op } from 'sequelize';
import Vacation from '../models/Vacation';
import User from '../models/User';

// Dados necessários pra criar um pedido de férias
export interface CreateVacationInput {
  userId: number;
  startDate: Date;
  endDate: Date;
  notes?: string;
}

class VacationService {
  /**
   * Cria um novo pedido de férias (status: pending)
   * Regras:
   * - não pode ter outro pedido pendente
   * - startDate <= endDate
   * - totalDays <= availableVacationDays do usuário
   */

  public async createVacationRequest(input: CreateVacationInput): Promise<Vacation> {
    const { userId, startDate, endDate, notes } = input;
  
    // 1) Garantir que o usuário existe
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    // 2) Validar datas: startDate <= endDate
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new Error('Invalid dates');
    }
  
    if (start > end) {
      throw new Error('startDate must be before or equal to endDate');
    }
  
    // 3) Regra: só pode tirar férias depois de 12 meses de trabalho
    const hiredAt: Date | null = user.hiredAt ?? null;
  
    if (hiredAt) {
      const oneYearAfterHire = new Date(hiredAt);
      oneYearAfterHire.setFullYear(oneYearAfterHire.getFullYear() + 1);
  
      if (start < oneYearAfterHire) {
        throw new Error('Employee must have at least 12 months of work to request vacations');
      }
    }
  
    // 4) Calcular quantidade de dias (férias são inclusivas: conta início e fim)
    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  
    if (totalDays <= 5) {
      throw new Error('Vacation period must be at least 5 day');
    }
  
    // 5) Verificar se já existe pedido pendente
    const today = new Date();
    const activeRequest = await Vacation.findOne({
      where: {
        userId,
        status: {
          [Op.in]: ['pending'],
        },
        endDate: {
          [Op.gte]: today,
        },
      },
    });
  
    // 6) Regra: no máximo 3 períodos de férias por ciclo
    // Aqui vamos considerar um "ciclo" de 12 meses a partir da data de admissão.
    // Descobrimos em qual ciclo esse pedido cai, e contamos quantos períodos já existem nele.
    if (hiredAt) {
      // diferença em ms entre o início das férias e a data de admissão
      const diffFromHireMs = start.getTime() - hiredAt.getTime();
      const diffFromHireDays = Math.floor(diffFromHireMs / (1000 * 60 * 60 * 24));
  
      // cada ciclo de 12 meses ~ 365 dias (aproximação simples)
      const cycleIndex = Math.floor(diffFromHireDays / 365);
  
      const cycleStart = new Date(hiredAt);
      cycleStart.setFullYear(cycleStart.getFullYear() + cycleIndex);
  
      const cycleEnd = new Date(cycleStart);
      cycleEnd.setFullYear(cycleEnd.getFullYear() + 1);
  
      // busca períodos APROVADOS dentro desse ciclo
      const vacationsInCycle = await Vacation.findAll({
        where: {
          userId,
          status: 'approved',
          startDate: {
            [Op.gte]: cycleStart,
          },
          endDate: {
            [Op.lte]: cycleEnd,
          },
        },
      });
  
      // +1 porque estamos considerando também o período que está sendo criado agora
      if (vacationsInCycle.length + 1 > 3) {
        throw new Error('Employee cannot have more than 3 vacation periods in the same cycle');
      }
    }
  
    // 7) Validar saldo de férias do usuário (regra dos 30 dias por ciclo fica
    // representada no campo availableVacationDays)
    const availableVacationDays: number = user.availableVacationDays ?? 0;
  
    if (totalDays > availableVacationDays) {
      throw new Error('Requested days exceed available vacation days');
    }
  
    // 8) Criar o pedido (status: pending)
    const vacation = await Vacation.create({
      userId,
      startDate,
      endDate,
      totalDays,
      status: 'pending',
      requestedAt: new Date(),
      notes: notes ?? null,
    });
  
    return vacation;
  } 
    


  // Lista todas as férias de um usuário (independente do status)
  public async getVacationsByUser(userId: number): Promise<Vacation[]> {
    const vacations = await Vacation.findAll({
      where: { userId },
      order: [['startDate', 'ASC']],
    });

    return vacations;
  }


  //  * Lista todas as férias do sistema (pra admin, por exemplo)
  public async getAllVacations(): Promise<Vacation[]> {
    const vacations = await Vacation.findAll({
      order: [['requestedAt', 'DESC']],
    });

    return vacations;
  }

  /**
   * Aprova um pedido de férias:
   * - checa se está pending
   * - verifica saldo de férias do usuário
   * - atualiza status para approved
   * - desconta do availableVacationDays
   */
  public async approveVacation(vacationId: number, adminId: number): Promise<Vacation> {
    const vacation = await Vacation.findByPk(vacationId);

    if (!vacation) {
      throw new Error('Vacation not found');
    }

    if (vacation.status !== 'pending') {
      throw new Error('Only pending vacations can be approved');
    }

    const user = await User.findByPk(vacation.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const availableVacationDays: number = user.availableVacationDays ?? 0;

    if (vacation.totalDays > availableVacationDays) {
      throw new Error('User does not have enough vacation days');
    }

    // Desconta saldo de férias do usuário
    user.availableVacationDays = availableVacationDays - vacation.totalDays;
    await user.save();

    // Atualiza a vacation
    vacation.status = 'approved';
    vacation.approvedAt = new Date();

    await vacation.save();

    return vacation;
  }

  /**
   * Rejeita um pedido de férias:
   * - checa se está pending
   * - seta status = rejected
   * - registra approvedAt e notes (motivo, por exemplo)
   */
  public async rejectVacation(
    vacationId: number,
    adminId: number,
    notes?: string
  ): Promise<Vacation> {
    const vacation = await Vacation.findByPk(vacationId);

    if (!vacation) {
      throw new Error('Vacation not found');
    }

    if (vacation.status !== 'pending') {
      throw new Error('Only pending vacations can be rejected');
    }

    vacation.status = 'rejected';
    vacation.approvedAt = new Date();
    vacation.notes = notes ?? null;

    await vacation.save();

    return vacation;
  }
}

const vacationService = new VacationService();
export default vacationService;
