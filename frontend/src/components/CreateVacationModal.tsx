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
    if (!validate()) return;
    onConfirm({ startDate, endDate });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Solicitar férias</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <Typography variant="body2">
            Preencha o período desejado para solicitar férias.
          </Typography>

          <TextField
            label="Data inicial"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <TextField
            label="Data final"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          Enviar solicitação
        </Button>
      </DialogActions>
    </Dialog>
  );
}
