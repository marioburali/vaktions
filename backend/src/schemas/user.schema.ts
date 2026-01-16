import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['admin', 'user']).default('user'),
  occupation: z.string().min(2, 'Cargo deve ter no mínimo 2 caracteres'),
  hiredAt: z.coerce.date({ 
    required_error: 'Data de admissão é obrigatória',
    invalid_type_error: 'Data de admissão inválida'
  }),
  availableVacationDays: z.number().int().min(0).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  role: z.enum(['admin', 'user']).optional(),
  occupation: z.string().min(2, 'Cargo deve ter no mínimo 2 caracteres').optional(),
  hiredAt: z.coerce.date({
    invalid_type_error: 'Data de admissão inválida'
  }).optional(),
  availableVacationDays: z.number().int().min(0).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
