import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Excluir solicitação de férias</DialogTitle>

      <DialogContent dividers>
        <Typography>
          Tem certeza que deseja excluir esta solicitação de férias?<br />
          {vacation && (
            <>
              <strong>
                {vacation.startDate} — {vacation.endDate}
              </strong>
            </>
          )}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          color="error"
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={onConfirm}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
