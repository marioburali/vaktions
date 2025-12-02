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
   * - pelo menos 12 meses de trabalho
   * - no máximo 3 períodos aprovados por ciclo de 12 meses
   * - no máximo 30 dias aprovados por ciclo de 12 meses
   * - pelo menos um período deve ter 14 dias ou mais
   * - cada período deve ter no mínimo 5 dias
   *    */

  public async createVacationRequest(
    input: CreateVacationInput
  ): Promise<Vacation> {
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
    const hiredAt: Date | null = (user as any).hiredAt ?? null;

    if (hiredAt) {
      const oneYearAfterHire = new Date(hiredAt);
      oneYearAfterHire.setFullYear(oneYearAfterHire.getFullYear() + 1);

      if (start < oneYearAfterHire) {
        throw new Error(
          'Employee must have at least 12 months of work to request vacations'
        );
      }
    }

    // 4) Calcular quantidade de dias (contando início e fim)
    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    // Regra: cada solicitação deve ter pelo menos 5 dias
    if (totalDays < 5) {
      throw new Error('Vacation period must be at least 5 days');
    }

    // 5) Regra: não pode ter outra solicitação PENDENTE
    const pendingRequest = await Vacation.findOne({
      where: {
        userId,
        status: 'pending',
      },
    });

    if (pendingRequest) {
      throw new Error('User already has a pending vacation request');
    }

    // 6) Definir ciclo (12 meses a partir da data de admissão) para aplicar regras por ciclo
    if (!hiredAt) {
      throw new Error(
        'User hire date (hiredAt) is required to calculate vacation cycles'
      );
    }

    const diffFromHireMs = start.getTime() - hiredAt.getTime();
    const diffFromHireDays = Math.floor(diffFromHireMs / (1000 * 60 * 60 * 24));
    const cycleIndex = Math.floor(diffFromHireDays / 365);

    const cycleStart = new Date(hiredAt);
    cycleStart.setFullYear(cycleStart.getFullYear() + cycleIndex);

    const cycleEnd = new Date(cycleStart);
    cycleEnd.setFullYear(cycleEnd.getFullYear() + 1);

    // 7) Buscar períodos APROVADOS dentro desse ciclo
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

    const periodsCount = vacationsInCycle.length;
    const totalApprovedDays = vacationsInCycle.reduce(
      (sum, v) => sum + v.totalDays,
      0
    );

    // 8) No máximo 3 períodos por ciclo
    if (periodsCount >= 3) {
      throw new Error(
        'Employee cannot have more than 3 vacation periods in the same cycle'
      );
    }

    // 9) Soma total dos períodos não pode passar de 30 dias
    const newTotalDaysInCycle = totalApprovedDays + totalDays;
    if (newTotalDaysInCycle > 30) {
      throw new Error('Total vacation days in the cycle cannot exceed 30 days');
    }

    // 10) Regras de fracionamento:
    // - Pelo menos um período precisa ter 14 dias ou mais
    // - Se este for o 3º período, ele deve completar os 30 dias e continuar respeitando:
    //   - cada período >= 5 dias
    //   - pelo menos um >= 14 dias

    // lista de dias dos períodos aprovados
    const approvedPeriodsDays = vacationsInCycle.map((v) => v.totalDays);

    if (periodsCount === 2) {
      // este pedido será o 3º período
      // a soma PRECISA fechar exatamente 30 dias
      if (newTotalDaysInCycle !== 30) {
        throw new Error(
          'On the third vacation period, the total days in the cycle must complete exactly 30 days'
        );
      }

      // garantir que em ALGUM dos 3 períodos >= 14 dias
      const maxDaysWithNew = Math.max(...approvedPeriodsDays, totalDays);
      if (maxDaysWithNew < 14) {
        throw new Error(
          'At least one vacation period in the cycle must be 14 days or more'
        );
      }
    } else {
      // se ainda estamos no 1º ou 2º período, não forçamos 14 dias já,
      // mas garante que ainda seja matematicamente possível ter um período >= 14 depois

      const maxExisting = approvedPeriodsDays.length
        ? Math.max(...approvedPeriodsDays)
        : 0;

      const remainingDays = 30 - newTotalDaysInCycle;

      const hasFourteenAlready = maxExisting >= 14 || totalDays >= 14;

      if (!hasFourteenAlready && remainingDays < 14 && periodsCount + 1 < 3) {
        // ainda não temos período >= 14,
        // ainda não é o 3º período,
        // e já vai sobrar menos de 14 dias pro futuro
        throw new Error(
          'With this request, it will not be possible to have a 14-day vacation period in this cycle'
        );
      }
    }

    // 11) Verificar saldo de férias do usuário
    const availableVacationDays: number =
      (user as any).availableVacationDays ?? 0;
    if (totalDays > availableVacationDays) {
      throw new Error('Requested days exceed available vacation days');
    }

    // 12) Criar o pedido (status: pending)
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

  // Lista todas as férias de um usuário 
  public async getVacationsByUser(userId: number): Promise<Vacation[]> {
    const vacations = await Vacation.findAll({
      where: { userId },
      order: [['startDate', 'ASC']],
    });

    return vacations;
  }

  //  * Lista todas as férias do sistema (pra admin)
  public async getAllVacations(): Promise<Vacation[]> {
    const vacations = await Vacation.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role', 'availableVacationDays'],
        },
      ],
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
  public async approveVacation(
    vacationId: number,
    adminId: number
  ): Promise<Vacation> {
    const vacation = await Vacation.findByPk(vacationId);

    if (!vacation) {
      throw new Error('Vacation not found');
    }

    if (vacation.status === 'approved') {
      throw new Error('Only pending and rejected vacations can be approved');
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

    if (vacation.status === 'rejected') {
      throw new Error('Only pending and approved vacations can be rejected');
    }

    const originalStatus = vacation.status;

    if (originalStatus === 'approved') {
      const user = await User.findByPk(vacation.userId);

      if (!user) {
        throw new Error('User not found');
      }

      const availableVacationDays: number = user.availableVacationDays ?? 0;
      user.availableVacationDays = availableVacationDays + vacation.totalDays;
      await user.save();
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
