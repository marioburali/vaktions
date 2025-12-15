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
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  vacation?: any;
};

export default function DeleteVacationModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  vacation,
}: Props) {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          backgroundColor: theme.tableBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ color: theme.textMain }}>
        Excluir solicitação de férias
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          borderColor: theme.border,
        }}
      >
        <Typography sx={{ color: theme.textSecondary }}>
          Tem certeza que deseja excluir esta solicitação de férias?
          <br />
          {vacation && (
            <strong>
              {vacation.startDate} — {vacation.endDate}
            </strong>
          )}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: theme.textSecondary,
            '&:hover': {
              backgroundColor: darkMode
                ? 'rgba(148,163,184,0.12)'
                : 'rgba(148,163,184,0.2)',
            },
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={onConfirm}
          sx={{
            backgroundColor: theme.error,
            color: '#fff',
            '&:hover': {
              backgroundColor: theme.errorHover,
            },
          }}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
