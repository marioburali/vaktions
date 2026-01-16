import { z } from 'zod';

export const createVacationSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  notes: z.string().max(500, 'Notas não podem ter mais de 500 caracteres').optional(),
}).refine(
  (data) => data.startDate <= data.endDate,
  {
    message: 'Data de início deve ser anterior ou igual à data de fim',
    path: ['startDate'],
  }
);

export const approveVacationSchema = z.object({
  notes: z.string().max(500, 'Notas não podem ter mais de 500 caracteres').optional(),
});

export const rejectVacationSchema = z.object({
  notes: z.string().min(10, 'Motivo da rejeição deve ter no mínimo 10 caracteres').max(500),
});

export type CreateVacationInput = z.infer<typeof createVacationSchema>;
export type ApproveVacationInput = z.infer<typeof approveVacationSchema>;
export type RejectVacationInput = z.infer<typeof rejectVacationSchema>;
