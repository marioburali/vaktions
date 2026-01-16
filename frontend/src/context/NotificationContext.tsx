import { createContext, useContext, ReactNode } from 'react';
import { useNotification } from '../hooks/useNotification';

interface NotificationContextType {
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { showError, showSuccess, showWarning, showInfo } = useNotification();

  return (
    <NotificationContext.Provider
      value={{ showError, showSuccess, showWarning, showInfo }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext deve ser usado dentro de NotificationProvider'
    );
  }
  return context;
}
