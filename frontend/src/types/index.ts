export interface User {}

export interface Vacation {}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: 'user' | 'admin';
    email: string;
  };
}
