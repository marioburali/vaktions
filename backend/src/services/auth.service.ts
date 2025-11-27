import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import userService from './user.service';

interface LoginInput {
  email: string;
  password: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  occupation?: string | null;
  hiredAt: Date | null;
  availableVacationDays: number;
}

interface LoginResult {
  token: string;
  user: Omit<UserData, 'password'>;
}

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN);

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const signOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN,
};

class AuthService {
  public async login({ email, password }: LoginInput): Promise<LoginResult> {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, signOptions);

    const plain = user.get({ plain: true });
    const { password: _, ...safeUser } = plain;

    return {
      token,
      user: safeUser,
    };
  }
}

const authService = new AuthService();
export default authService;
