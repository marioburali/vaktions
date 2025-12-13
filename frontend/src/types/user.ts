export type Role = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  occupation: string;
  hiredAt: string | null;
  availableVacationDays: number;
}

export type UserFormData = {
  name: string;
  email: string;
  role: Role;
  occupation: string;
  hiredAt: string;
  password?: string;
};

export type UserFormMode = 'create' | 'edit';
