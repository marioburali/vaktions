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
  onConfirm: (data: { startDate: string; endDate: string }) => void;
  loading?: boolean;
};

export default function CreateVacationModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: Props) {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [error, setError] = React.useState('');

  const validate = () => {
    if (!startDate.trim() || !endDate.trim()) {
      setError('Data inicial e final são obrigatórias.');
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('A data inicial não pode ser maior que a final.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate() || loading) return;
    onConfirm({ startDate, endDate });
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
        Solicitar férias
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          borderColor: theme.border,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <Typography variant="body2" sx={{ color: theme.textSecondary }}>
            Preencha o período desejado para solicitar férias.
          </Typography>

          <TextField
            label="Data inicial"
            type="date"
            InputLabelProps={{
              shrink: true,
              sx: { color: theme.textSecondary },
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputProps={{
              sx: {
                color: theme.textMain,
                backgroundColor: darkMode
                  ? 'rgba(15,23,42,0.6)'
                  : '#ffffff',
              },
            }}
          />

          <TextField
            label="Data final"
            type="date"
            InputLabelProps={{
              shrink: true,
              sx: { color: theme.textSecondary },
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputProps={{
              sx: {
                color: theme.textMain,
                backgroundColor: darkMode
                  ? 'rgba(15,23,42,0.6)'
                  : '#ffffff',
              },
            }}
          />

          {error && (
            <Typography
              variant="body2"
              sx={{ color: theme.error }}
            >
              {error}
            </Typography>
          )}
        </Box>
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
          onClick={handleSubmit}
          sx={{
            backgroundColor: theme.blueButton,
            '&:hover': {
              backgroundColor: theme.blueButtonHover,
            },
            '&.Mui-disabled': {
              backgroundColor: darkMode
                ? 'rgba(59,130,246,0.35)'
                : 'rgba(59,130,246,0.4)',
              color: '#fff',
            },
          }}
        >
          Enviar solicitação
        </Button>
      </DialogActions>
    </Dialog>
  );
}
