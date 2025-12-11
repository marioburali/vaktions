import { apiFetch } from './api';

export async function getAllVacations() {
  const token = localStorage.getItem('token');
  return apiFetch('/vacations', { method: 'GET' }, token || undefined);
}

export async function getVacationsByUser() {
  const token = localStorage.getItem('token');
  return apiFetch(`/vacations/me`, { method: 'GET' }, token || undefined);
}

export async function approveVacation(id: number) {
  const token = localStorage.getItem('token');
  return apiFetch(
    `/vacations/${id}/approve`,
    { method: 'PATCH' },
    token || undefined
  );
}

export async function rejectVacation(id: number, notes?: string) {
  const token = localStorage.getItem('token');
  return apiFetch(
    `/vacations/${id}/reject`,
    {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    },
    token || undefined
  );
}

export async function createVacation(startDate: string, endDate: string) {
  const token = localStorage.getItem('token');
  return apiFetch(
    `/vacations`,
    {
      method: 'POST',
      body: JSON.stringify({ startDate, endDate }),
    },
    token || undefined
  );
}

export async function deleteVacation(id: number) {
  const token = localStorage.getItem('token');
  return apiFetch(
    `/vacations/${id}`,
    {
      method: 'DELETE',
    },
    token || undefined
  );
}