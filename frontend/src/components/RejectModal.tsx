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
    if (isInvalid) return; // não deixa enviar
    onConfirm(notes.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Rejeitar solicitação</DialogTitle>

      <DialogContent dividers>
        {vacation && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2">
              <strong>Colaborador:</strong>{' '}
              {vacation.user?.name ?? `Usuário #${vacation.userId}`}
            </Typography>

            <Typography variant="body2">
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
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={handleSubmit}
        >
          Confirmar rejeição
        </Button>
      </DialogActions>
    </Dialog>
  );
}
