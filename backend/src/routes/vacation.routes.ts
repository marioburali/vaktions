// src/routes/vacation.routes.ts
import { Router } from 'express';
import vacationController from '../controllers/vacation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de férias exigem usuário autenticado
router.use(authMiddleware);

// Usuário logado cria um pedido de férias
router.post('/', (req, res) =>
  vacationController.createVacationRequest(req, res)
);

// Usuário logado vê apenas as próprias férias
router.get('/me', (req, res) => vacationController.getMyVacations(req, res));

// Admin vê todas as férias do sistema
router.get('/', (req, res) => vacationController.getAllVacations(req, res));

// Admin aprova um pedido
router.patch('/:id/approve', (req, res) =>
  vacationController.approveVacation(req, res)
);

// Admin rejeita um pedido
router.patch('/:id/reject', (req, res) =>
  vacationController.rejectVacation(req, res)
);

export default router;
