import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  loading?: boolean;
  vacation?: {
    id: number;
    user?: { name: string };
    userId: number;
    startDate: string;
    endDate: string;
    notes?: string | null;
  };
};

export default function RejectModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  vacation,
}: Props) {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  const [notes, setNotes] = React.useState('');
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (vacation) {
      setNotes(vacation.notes || '');
      setTouched(false);
    }
  }, [vacation]);

  const isInvalid = notes.trim().length === 0;

  const handleSubmit = () => {
    setTouched(true);
    if (isInvalid) return;
    onConfirm(notes.trim());
  };

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
      <DialogTitle sx={{ color: theme.textMain }}>
        Rejeitar solicitação
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          borderColor: theme.border,
        }}
      >
        {vacation && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: theme.textSecondary }}>
              <strong>Colaborador:</strong>{' '}
              {vacation.user?.name ?? `Usuário #${vacation.userId}`}
            </Typography>

            <Typography variant="body2" sx={{ color: theme.textSecondary }}>
              <strong>Período:</strong> {vacation.startDate} —{' '}
              {vacation.endDate}
            </Typography>

            <TextField
              label="Motivo da rejeição"
              multiline
              minRows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Descreva o motivo..."
              error={touched && isInvalid}
              helperText={
                touched && isInvalid ? 'O motivo é obrigatório.' : ' '
              }
              InputLabelProps={{
                sx: { color: theme.textSecondary },
              }}
              InputProps={{
                sx: {
                  color: theme.textMain,
                  backgroundColor: darkMode ? 'rgba(15,23,42,0.6)' : '#ffffff',
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: theme.textSecondary }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            backgroundColor: theme.error,
            '&:hover': {
              backgroundColor: theme.errorHover,
            },
          }}
        >
          Confirmar rejeição
        </Button>
      </DialogActions>
    </Dialog>
  );
}
