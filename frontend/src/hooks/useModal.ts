import { useState, useCallback } from 'react';

export function useModal<T = undefined>() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = useCallback((payload?: T) => {
    if (payload !== undefined) {
      setData(payload);
    }
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setData(null);
  }, []);

  return {
    open,
    data,
    openModal,
    closeModal,
  };
}
