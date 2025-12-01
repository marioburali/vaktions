import { Request, Response } from 'express';
import vacationService, {
  CreateVacationInput,
} from '../services/vacation.service';

// Tipagem da request autenticada, assumindo que o authMiddleware preenche req.user
interface AuthUser {
  id: number;
  role: 'admin' | 'user';
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

class VacationController {
  /**
   * POST /vacations
   * Cria um novo pedido de férias para o usuário logado.
   */
  public async createVacationRequest(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { startDate, endDate, notes } = req.body;

      const input: CreateVacationInput = {
        userId: req.user.id,
        startDate,
        endDate,
        notes,
      };

      const vacation = await vacationService.createVacationRequest(input);

      // transforma em objeto "limpo" (sem métodos do Sequelize)
      const plain = vacation.get({ plain: true });

      return res.status(201).json(plain);
    } catch (error: any) {
      const { status, message } = this.mapError(error);
      return res.status(status).json({ message });
    }
  }

  /**
   * GET /vacations/me
   * Lista todas as férias do usuário logado.
   */
  public async getMyVacations(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const vacations = await vacationService.getVacationsByUser(req.user.id);

      const plain = vacations.map((v) => v.get({ plain: true }));

      return res.status(200).json(plain);
    } catch (error: any) {
      const { status, message } = this.mapError(error);
      return res.status(status).json({ message });
    }
  }

  /**
   * GET /vacations
   * Lista todas as férias do sistema (apenas admin)
   */
  public async getAllVacations(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const vacations = await vacationService.getAllVacations();
      const plain = vacations.map((v) => v.get({ plain: true }));

      return res.status(200).json(plain);
    } catch (error: any) {
      const { status, message } = this.mapError(error);
      return res.status(status).json({ message });
    }
  }

  /**
   * PATCH /vacations/:id/approve
   * Aprova um pedido de férias (admin)
   */
  public async approveVacation(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const vacationId = Number(req.params.id);

      if (Number.isNaN(vacationId)) {
        return res.status(400).json({ message: 'Invalid vacation id' });
      }

      const vacation = await vacationService.approveVacation(
        vacationId,
        req.user.id
      );

      const plain = vacation.get({ plain: true });

      return res.status(200).json(plain);
    } catch (error: any) {
      const { status, message } = this.mapError(error);
      return res.status(status).json({ message });
    }
  }

  /**
   * PATCH /vacations/:id/reject
   * Rejeita um pedido de férias (apenas admin).
   * Aceita um campo "notes" no body, com o motivo.
   */
  public async rejectVacation(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const vacationId = Number(req.params.id);
      const { notes } = req.body;

      if (Number.isNaN(vacationId)) {
        return res.status(400).json({ message: 'Invalid vacation id' });
      }

      const vacation = await vacationService.rejectVacation(
        vacationId,
        req.user.id,
        notes
      );

      const plain = vacation.get({ plain: true });

      return res.status(200).json(plain);
    } catch (error: any) {
      const { status, message } = this.mapError(error);
      return res.status(status).json({ message });
    }
  }

  /**
   * Mapeia mensagens de erro de regra de negócio para status HTTP.
   * Isso deixa as respostas mais semânticas e fáceis de debugar.
   */
  private mapError(error: any): { status: number; message: string } {
    const defaultMessage =
      error instanceof Error ? error.message : 'Internal server error';

    if (!(error instanceof Error)) {
      return { status: 500, message: defaultMessage };
    }

    const msg = error.message;

    // 404 - recursos não encontrados
    if (msg === 'User not found' || msg === 'Vacation not found') {
      return { status: 404, message: msg };
    }

    // 400 - erros de validação / regra de negócio
    const badRequestErrors = [
      'Invalid dates',
      'startDate must be before or equal to endDate',
      'Employee must have at least 12 months of work to request vacations',
      'Vacation period must be at least 1 day',
      'User already has an active vacation request',
      'Requested days exceed available vacation days',
      'User does not have enough vacation days',
      'Only pending vacations can be approved',
      'Only pending vacations can be rejected',
      'Employee cannot have more than 3 vacation periods in the same cycle',
    ];

    if (badRequestErrors.includes(msg)) {
      return { status: 400, message: msg };
    }

    // fallback: erro interno
    return { status: 500, message: defaultMessage };
  }
}

export default new VacationController();
