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
  user?: any;
};

export default function DeleteUserModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  user,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Excluir usuário</DialogTitle>

      <DialogContent dividers>
        <Typography>
          Tem certeza que deseja excluir{' '}
          <strong>{user?.name || 'este usuário'}</strong>?
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
