import User from '../models/User';
import bcrypt from 'bcryptjs';

// dados que se esperam para criar um novo usuário
type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  occupation?: string;
  hiredAt?: Date | null;
  availableVacationDays?: number;
};

class UserService {
  // listar todos os usuários
  async getAllUsers(): Promise<User[]> {
    const users = User.findAll();
    return users;
  }

  // buscar usuário por ID
  async getUserById(id: number): Promise<User | null> {
    const user = await User.findByPk(id);
    return user;
  }

  // buscar usuário por email
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  // criar um novo usuário
  async createUser(data: CreateUserInput): Promise<User> {
    const existing = await this.getUserByEmail(data.email);
    if (existing) {
      throw new Error('Email already in use');
    }

    const role = data.role ?? 'user';

    const availableVacationDays = data.availableVacationDays ?? 30;

    const hiredAt = data.hiredAt ?? null;

    // hashear a senha antes de salvar (omitted for brevity)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
      occupation: data.occupation,
      hiredAt,
      availableVacationDays,
    });
    return newUser;
  }

  // Atualizar os dias de férias disponíveis de um usuário
  async updateAvailableVacationDays(userId: number, days: number) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.availableVacationDays = days;
    await user.save();

    return user;
  }
}

const userService = new UserService();
export default userService;
