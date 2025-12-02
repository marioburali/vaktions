import { apiFetch } from './api';

export async function getAllUsers() {
  const token = localStorage.getItem('token');
  return apiFetch('/users', { method: 'GET' }, token || undefined);
}

export async function createUser(data: any) {
  const token = localStorage.getItem('token');
  return apiFetch(
    '/users',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token || undefined
  );
}

export async function updateUser(id: number, data: any) {
  const token = localStorage.getItem('token');
  return apiFetch(
    `/users/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token || undefined
  );
}

export async function deleteUser(id: number) {
  const token = localStorage.getItem('token');
  return apiFetch(`/users/${id}`, { method: 'DELETE' }, token || undefined);
}
