import type { User } from "./user";

export type VacationStatus = 'pending' | 'approved' | 'rejected';

export interface Vacation {
  id: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: VacationStatus;
  notes?: string | null;
  updatedAt: string;
  createdAt?: string;
  userId?: number;
  user?: User | null;
}
