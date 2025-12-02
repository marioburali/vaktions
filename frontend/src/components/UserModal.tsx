import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading?: boolean;
  mode: 'create' | 'edit';
  user?: any;
};

export default function UserModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  mode,
  user,
}: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    occupation: '',
    hiredAt: '',
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        occupation: user.occupation,
        hiredAt: user.hiredAt.split('T')[0],
      });
    } else {
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
        occupation: '',
        hiredAt: '',
      });
    }
  }, [mode, user]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isPasswordRequired = mode === 'create';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === 'create' ? 'Criar usuário' : 'Editar usuário'}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome"
            fullWidth
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <TextField
            label="Senha"
            fullWidth
            type="password"
            value={form.password}
            required={isPasswordRequired}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={mode === 'edit' ? 'Preencha caso queira trocar' : ''}
          />

          <TextField
            select
            label="Função"
            fullWidth
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            <MenuItem value="user">Usuário</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <TextField
            label="Cargo / Ocupação"
            fullWidth
            value={form.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
          />

          <TextField
            label="Data de admissão"
            type="date"
            fullWidth
            value={form.hiredAt}
            onChange={(e) => handleChange('hiredAt', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={() => onConfirm(form)}
        >
          {mode === 'create' ? 'Criar' : 'Salvar alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
