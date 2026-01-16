import { useCallback, useState } from 'react';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (message: string, type: NotificationType = 'info', title?: string) => {
      const id = generateId();
      const notification: Notification = {
        id,
        type,
        message,
        title,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove após 5 segundos
      const timeout = setTimeout(() => {
        removeNotification(id);
      }, 5000);

      return { id, timeout };
    },
    [removeNotification]
  );

  const showError = useCallback(
    (message: string, title = 'Erro') => {
      return showNotification(message, 'error', title);
    },
    [showNotification]
  );

  const showSuccess = useCallback(
    (message: string, title = 'Sucesso') => {
      return showNotification(message, 'success', title);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, title = 'Atenção') => {
      return showNotification(message, 'warning', title);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, title = 'Informação') => {
      return showNotification(message, 'info', title);
    },
    [showNotification]
  );

  return {
    notifications,
    showNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    removeNotification,
  };
}
