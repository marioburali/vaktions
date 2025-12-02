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
  const displayMessage =
    message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2">{displayMessage}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
