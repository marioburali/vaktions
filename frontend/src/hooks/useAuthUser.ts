import { useEffect, useState } from 'react';
import type { User } from '../types';

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) {
        setUser(null);
        return;
      }
      setUser(JSON.parse(stored) as User);
    } catch {
      setUser(null);
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  return { user, isAdmin };
}
