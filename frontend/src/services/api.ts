const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string
) {
  if (!API_URL) {
    throw new Error('API URL is not defined in environment variables');
  }

  const url = `${API_URL}${path}`;

  const headers: HeadersInit & { Authorization?: string } = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'HTTP Error');
  }

  return data;
}
