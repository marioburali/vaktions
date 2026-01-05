import { useState } from 'react';

export function useModal<T = undefined>() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = (payload?: T) => {
    if (payload !== undefined) {
      setData(payload);
    }
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setData(null);
  };

  return {
    open,
    data,
    openModal,
    closeModal,
  };
}
