import { Router } from 'express';
import vacationController from '../controllers/vacation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createVacationSchema, approveVacationSchema, rejectVacationSchema } from '../schemas/vacation.schema';

const router = Router();

// Todas as rotas de férias exigem usuário autenticado
router.use(authMiddleware);

// Usuário logado cria um pedido de férias
router.post('/', validate(createVacationSchema), (req, res) =>
  vacationController.createVacationRequest(req, res)
);

// Usuário logado vê apenas as próprias férias
router.get('/me', (req, res) => vacationController.getMyVacations(req, res));

// Admin vê todas as férias do sistema
router.get('/', (req, res) => vacationController.getAllVacations(req, res));

// Admin aprova um pedido
router.patch('/:id/approve', validate(approveVacationSchema), (req, res) =>
  vacationController.approveVacation(req, res)
);

// Admin rejeita um pedido
router.patch('/:id/reject', validate(rejectVacationSchema), (req, res) =>
  vacationController.rejectVacation(req, res)
);

// deletar vacation
router.delete('/:id', (req, res, next) =>
  vacationController.deleteVacation(req, res, next)
);
export default router;
