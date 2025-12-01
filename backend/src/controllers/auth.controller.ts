import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { mapError } from '../utils/errorMapper';

class AuthController {
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required',
        });
      }

      const result = await authService.login({ email, password });

      return res.status(200).json(result);
    } catch (error) {
      const { status, message } = mapError(error);
      return res.status(status).json({ message });
    }
  }
}

export default new AuthController();
