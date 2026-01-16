import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../context/NotificationContext';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showError, showSuccess } = useNotificationContext();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      showSuccess('Login realizado com sucesso!');
      navigate('/home');
    } catch (err: any) {
      showError(err.message || 'Erro ao fazer login', 'Falha no Login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 900,
          width: '100%',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box
            sx={{
              flex: 1,
              background:
                'radial-gradient(circle at top left, #3c4661 10%, #10172A 70%, #0f172a 100%)',
              color: '#e5e7eb',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                VaKtions
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }} marginTop={4}>
                Cuidando das férias de seus colaboradores de forma simples e
                profissional. Faça login para acessar o painel.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: { xs: 3, md: 5 },
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
          >
            <Typography variant="h5" fontWeight={600} mb={1}>
              Bem-vindo!
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Acesse sua conta.
            </Typography>

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                  mb: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Lembrar de mim"
                />
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                >
                  Esqueci minha senha
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
