import User from '../models/User';
import bcrypt from 'bcryptjs';

// dados que se esperam para criar um novo usuário
type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  occupation: string;
  hiredAt: Date;
  availableVacationDays?: number;
};

// calcular os dias iniciais de férias com base na data de admissão
function calculateInitialVacationDays(hiredAt: Date): number {
  const today = new Date();

  const diffMs = today.getTime() - hiredAt.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= 365) {
    return 30;
  }

  return 0;
}

class UserService {
  // listar todos os usuários
  async getAllUsers(): Promise<User[]> {
    const users = User.findAll({
      order: [['id', 'ASC']],
    });
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

    const hiredAtDate = new Date(data.hiredAt);
    if (Number.isNaN(hiredAtDate.getTime())) {
      throw new Error('Invalid hiredAt date');
    }

    const availableVacationDays =
      data.availableVacationDays ?? calculateInitialVacationDays(hiredAtDate);

    // hashear a senha antes de salvar (omitted for brevity)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
      occupation: data.occupation,
      hiredAt: data.hiredAt,
      availableVacationDays,
    });
    return newUser;
  }

  async editUser(
    userId: number,
    data: Partial<CreateUserInput>
  ): Promise<User> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.getUserByEmail(data.email);
      if (existing) {
        throw new Error('Email already in use');
      }
    }

    const updateData: Partial<CreateUserInput> = { ...data };

    if (data.hiredAt) {
      const hiredAtDate = new Date(data.hiredAt);
      if (Number.isNaN(hiredAtDate.getTime())) {
        throw new Error('Invalid hiredAt date');
      }

      updateData.hiredAt = hiredAtDate;

      if (user.availableVacationDays === 0) {
        updateData.availableVacationDays =
          calculateInitialVacationDays(hiredAtDate);
      }
    }

    if (data.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(data.password, saltRounds);
    }

    await user.update(updateData);
    return user;
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
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
