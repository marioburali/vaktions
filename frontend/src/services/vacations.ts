import { apiFetch } from './api';

export async function getAllVacations() {
  const token = localStorage.getItem('token');
  return apiFetch('/vacations', { method: 'GET' }, token || undefined);
}