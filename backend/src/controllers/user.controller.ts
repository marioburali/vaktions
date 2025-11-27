import { Request, Response } from 'express';
import userService from '../services/user.service';
import User from '../models/User';

class UserController {
  // lista todos os usuários
  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users: User[] = await userService.getAllUsers();

      // Remover senha da resposta
      const safeUsers = users.map((user: User) => {
        const plain = user.get({ plain: true });
        const { password, ...rest } = plain;
        return rest;
      });

      return res.status(200).json(safeUsers);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // busca usuário por ID
  public async getUserById(req: Request, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    try {
      const user: User | null = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Remover senha da resposta
      const plain = user.get({ plain: true });
      const { password, ...safeUser } = plain;

      return res.status(200).json(safeUser);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // busca usuário por email
  public async getUserByEmail(req: Request, res: Response): Promise<Response> {
    const email = req.params.email;
    try {
      const user: User | null = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Remover senha da resposta
      const plain = user.get({ plain: true });
      const { password, ...safeUser } = plain;

      return res.status(200).json(safeUser);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // criar um novo usuário
  public async createUser(req: Request, res: Response): Promise<Response> {
    const userData = req.body;
    try {
      const newUser: User = await userService.createUser(userData);

      // Remover senha da resposta
      const plain = newUser.get({ plain: true });
      const { password, ...safeUser } = plain;

      return res.status(201).json(safeUser);
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // editar um usuário
  public async editUser(req: Request, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    const userData = req.body;
    try {
      const updatedUser: User = await userService.editUser(userId, userData);

      // Remover senha da resposta
      const plain = updatedUser.get({ plain: true });
      const { password, ...safeUser } = plain;

      return res.status(200).json({message: 'User updated', safeUser});
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Email already in use') {
        return res.status(409).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // deletar usuário
  public async deleteUser(req: Request, res: Response): Promise<Response> {
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }
    try {
      await userService.deleteUser(userId);
      return res.status(200).json({ message: 'User deleted' });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
export default new UserController();
