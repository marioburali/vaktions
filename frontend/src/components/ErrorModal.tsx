import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

type Props = {
  open: boolean;
  message?: string;
  onClose: () => void;
  title?: string;
};

export default function ErrorModal({
  open,
  message,
  onClose,
  title = 'Algo deu errado',
}: Props) {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  const displayMessage =
    message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: theme.tableBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ color: theme.textMain }}>{title}</DialogTitle>

      <DialogContent
        dividers
        sx={{
          borderColor: theme.border,
        }}
      >
        <Typography variant="body2" sx={{ color: theme.textSecondary }}>
          {displayMessage}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: theme.textSecondary,
            '&:hover': {
              backgroundColor: darkMode
                ? 'rgba(148,163,184,0.12)'
                : 'rgba(148,163,184,0.2)',
            },
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
