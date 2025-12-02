import { apiFetch } from './api';
import type { LoginResponse } from '../types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
