import { Request, Response } from 'express';
import authService from '../services/auth.service';

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
    } catch (error: any) {
      console.error('Error during login:', error);

      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new AuthController();
