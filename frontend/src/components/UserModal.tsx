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
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading?: boolean;
  mode: 'create' | 'edit';
  user?: any;
};

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  occupation: '',
  hiredAt: '',
};

export default function UserModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  mode,
  user,
}: Props) {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      return;
    }

    if (mode === 'edit' && user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user',
        occupation: user.occupation || '',
        hiredAt: user.hiredAt ? user.hiredAt.split('T')[0] : '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, mode, user]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isPasswordRequired = mode === 'create';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailInvalid =
    form.email.trim().length > 0 && !emailRegex.test(form.email.trim());

  const canSubmit =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    !emailInvalid &&
    form.occupation.trim().length > 0 &&
    form.hiredAt.trim().length > 0 &&
    (!isPasswordRequired || form.password.trim().length > 0);

  const handleConfirmClick = () => {
    if (!canSubmit || loading) return;
    onConfirm(form);
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
        {mode === 'create' ? 'Criar usuário' : 'Editar usuário'}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          borderColor: theme.border,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome"
            fullWidth
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            autoComplete="off"
            InputLabelProps={{ sx: { color: theme.textSecondary } }}
            InputProps={{
              sx: {
                color: theme.textMain,
                backgroundColor: darkMode ? 'rgba(15,23,42,0.6)' : '#ffffff',
              },
            }}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            autoComplete="off"
            error={emailInvalid}
            helperText={emailInvalid ? 'Informe um email válido.' : ' '}
            InputLabelProps={{ sx: { color: theme.textSecondary } }}
            InputProps={{
              sx: {
                color: theme.textMain,
                backgroundColor: darkMode ? 'rgba(15,23,42,0.6)' : '#ffffff',
              },
            }}
          />

          <TextField
            label="Senha"
            fullWidth
            type="password"
            value={form.password}
            required={isPasswordRequired}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={mode === 'edit' ? 'Preencha caso queira trocar' : ''}
            autoComplete="new-password"
            InputLabelProps={{ sx: { color: theme.textSecondary } }}
            InputProps={{
              sx: {
                color: theme.textMain,
                backgroundColor: darkMode ? 'rgba(15,23,42,0.6)' : '#ffffff',
              },
            }}
          />

          <TextField
            select
            label="Função"
            fullWidth
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
            InputLabelProps={{ sx: { color: theme.textSecondary } }}
            InputProps={{
              sx: {
                color: theme.textMain,
                backgroundColor: darkMode ? 'rgba(15,23,42,0.6)' : '#ffffff',
              },
            }}
          >
            <MenuItem value="user">Usuário</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <TextField
            label="Cargo / Ocupação"
            fullWidth
            value={form.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            autoComplete="off"
            InputLabelProps={{ sx: { color: theme.textSecondary } }}
            InputProps={{
              sx: {
                color: theme.textMain,
                backgroundColor: darkMode ? 'rgba(15,23,42,0.6)' : '#ffffff',
              },
            }}
          />

          <TextField
            label="Data de admissão"
            type="date"
            fullWidth
            value={form.hiredAt}
            onChange={(e) => handleChange('hiredAt', e.target.value)}
            InputLabelProps={{
              shrink: true,
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
          disabled={loading || !canSubmit}
          onClick={handleConfirmClick}
          sx={{
            backgroundColor: theme.blueButton,
            color: theme.textMain,
            '&:hover': {
              backgroundColor: theme.blueButtonHover,
            },
            '&.Mui-disabled': {
              backgroundColor: darkMode
                ? 'rgba(148,163,184,0.25)'
                : 'rgba(148,163,184,0.4)',
              color: darkMode ? 'rgba(226,232,240,0.6)' : 'rgba(30,41,59,0.6)',
            },
          }}
        >
          {mode === 'create' ? 'Criar' : 'Salvar alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
