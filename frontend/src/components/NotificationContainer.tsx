import { Alert, Box, IconButton } from '@mui/material';
import type { AlertColor } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotification } from '../hooks/useNotification';
import type { Notification } from '../hooks/useNotification';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        maxWidth: 400,
        pointerEvents: 'none',
      }}
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          theme={theme}
        />
      ))}
    </Box>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
  theme: {
    textMain: string;
    [key: string]: string | number | object;
  };
}

function NotificationItem({
  notification,
  onClose,
  theme,
}: NotificationItemProps) {
  const alertSeverity: AlertColor = notification.type === 'error' ? 'error' : (notification.type as AlertColor);

  return (
    <Alert
      severity={alertSeverity}
      onClose={onClose}
      sx={{
        pointerEvents: 'auto',
        backgroundColor:
          notification.type === 'error'
            ? 'rgba(244, 67, 54, 0.15)'
            : notification.type === 'success'
              ? 'rgba(76, 175, 80, 0.15)'
              : notification.type === 'warning'
                ? 'rgba(255, 193, 7, 0.15)'
                : 'rgba(33, 150, 243, 0.15)',
        borderRadius: 2,
        border: '1px solid',
        borderColor:
          notification.type === 'error'
            ? 'rgba(244, 67, 54, 0.5)'
            : notification.type === 'success'
              ? 'rgba(76, 175, 80, 0.5)'
              : notification.type === 'warning'
                ? 'rgba(255, 193, 7, 0.5)'
                : 'rgba(33, 150, 243, 0.5)',
        color: theme.textMain,
        animation: 'slideIn 0.3s ease-in-out',
        '@keyframes slideIn': {
          from: {
            transform: 'translateX(400px)',
            opacity: 0,
          },
          to: {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
      }}
      action={
        <IconButton
          size="small"
          color="inherit"
          onClick={onClose}
          sx={{ pointerEvents: 'auto' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <div>
        {notification.title && (
          <strong>{notification.title}</strong>
        )}
        {notification.title && <br />}
        {notification.message}
      </div>
    </Alert>
  );
}
