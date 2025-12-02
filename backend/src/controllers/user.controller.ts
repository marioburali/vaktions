import { Request, Response } from 'express';
import userService from '../services/user.service';
import User from '../models/User';
import HTTP_STATUS from '../utils/httpStatus';
import { mapError } from '../utils/errorMapper';

class UserController {
  // lista todos os usuários
  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users: User[] = await userService.getAllUsers();

      const safeUsers = users.map((user: User) => {
        const plain = user.get({ plain: true });
        const { password, ...rest } = plain;
        return rest;
      });

      return res.status(HTTP_STATUS.OK).json(safeUsers);
    } catch (error) {
      const { status, message } = mapError(error);
      return res.status(status).json({ message });
    }
  }

  // busca usuário por ID
  public async getUserById(req: Request, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Invalid user id' });
    }

    try {
      const user: User | null = await userService.getUserById(userId);
      if (!user) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: 'User not found' });
      }

      const plain = user.get({ plain: true });
      const { password, ...safeUser } = plain;

      return res.status(HTTP_STATUS.OK).json(safeUser);
    } catch (error) {
      const { status, message } = mapError(error);
      return res.status(status).json({ message });
    }
  }

  // busca usuário por email
  public async getUserByEmail(req: Request, res: Response): Promise<Response> {
    const email = req.params.email;

    try {
      const user: User | null = await userService.getUserByEmail(email);
      if (!user) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: 'User not found' });
      }

      const plain = user.get({ plain: true });
      const { password, ...safeUser } = plain;

      return res.status(HTTP_STATUS.OK).json(safeUser);
    } catch (error) {
      const { status, message } = mapError(error);
      return res.status(status).json({ message });
    }
  }

  // criar um novo usuário
  public async createUser(req: Request, res: Response): Promise<Response> {
    const userData = req.body;

    try {
      const newUser: User = await userService.createUser(userData);

      const plain = newUser.get({ plain: true });
      const { password, ...safeUser } = plain;

      return res
        .status(HTTP_STATUS.CREATED)
        .json({ message: 'User created', safeUser });
    } catch (error: any) {
      // se a service joga "Email already in use", o mapper devolve 409
      const { status, message } = mapError(error);
      return res.status(status).json({ message });
    }
  }

  // editar um usuário
  public async editUser(req: Request, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Invalid user id' });
    }

    const userData = req.body;

    try {
      const updatedUser: User = await userService.editUser(userId, userData);

      const plain = updatedUser.get({ plain: true });
      const { password, ...safeUser } = plain;

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: 'User updated', safeUser });
    } catch (error: any) {
      const { status, message } = mapError(error);
      return res.status(status).json({ message });
    }
  }

  // deletar usuário
  public async deleteUser(req: Request, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Invalid user id' });
    }

    try {
      await userService.deleteUser(userId);
      return res.status(HTTP_STATUS.OK).json({ message: 'User deleted' });
    } catch (error: any) {
      const { status, message } = mapError(error);
      return res.status(status).json({ message });
    }
  }
}

export default new UserController();
