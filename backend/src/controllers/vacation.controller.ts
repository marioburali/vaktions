import { NextFunction, Request, Response } from 'express';
import vacationService, {
  CreateVacationInput,
} from '../services/vacation.service';
import { mapError } from '../utils/errorMapper';

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

      const { startDate, endDate } = req.body;

      const input: CreateVacationInput = {
        userId: req.user.id,
        startDate,
        endDate,
        // notes,
      };

      const vacation = await vacationService.createVacationRequest(input);

      // transforma em objeto "limpo" (sem métodos do Sequelize)
      const plain = vacation.get({ plain: true });

      return res.status(201).json(plain);
    } catch (error: any) {
      const { status, message } = mapError(error);
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
      const { status, message } = mapError(error);
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
      const { status, message } = mapError(error);
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
      const { status, message } = mapError(error);
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
      const { status, message } = mapError(error);
      return res.status(status).json({ message });
    }
  }

  public deleteVacation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const vacationId = Number(req.params.id);
      const userId = req.user.id;
      const role = req.user.role;

      await vacationService.deleteVacation(vacationId, userId, role);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new VacationController();
