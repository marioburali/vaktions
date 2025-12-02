import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Divider, Stack } from '@mui/material';
import Header from '../components/Header';
import { formatDate } from '../utils/formatDate';

type Role = 'admin' | 'user';

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  occupation?: string;
  hiredAt?: string | null;
  availableVacationDays: number;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const bgColor = darkMode ? '#020617' : '#f3f4f6';
  const cardBg = darkMode ? '#0b1120' : '#ffffff';
  const textMain = darkMode ? '#e5e7eb' : '#0f172a';
  const textSecondary = darkMode ? '#cbd5f5' : '#4b5563';
  const borderColor = darkMode ? 'rgba(148,163,184,0.35)' : '#e5e7eb';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: bgColor }}>
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />

      <Box
        sx={{
          p: 4,
          maxWidth: 720,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={2}
          sx={{ color: textMain }}
        >
          Meus dados
        </Typography>

        {!user && (
          <Typography sx={{ color: textSecondary }}>
            Não foi possível carregar seus dados. Faça login novamente.
          </Typography>
        )}

        {user && (
          <Paper
            sx={{
              backgroundColor: cardBg,
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              p: 3,
              boxShadow: darkMode
                ? '0 10px 30px rgba(15,23,42,0.6)'
                : '0 8px 20px rgba(15,23,42,0.12)',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
              }}
            >
              <Chip
                label={user.role}
                size="small"
                color={user.role === 'admin' ? 'primary' : 'success'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            <Stack spacing={2} mt={2}>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ color: textMain }}
                >
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: textSecondary }}>
                  ID: {user.id}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: textSecondary, textTransform: 'uppercase' }}
                >
                  Email
                </Typography>
                <Typography sx={{ color: textMain }}>{user.email}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: textSecondary, textTransform: 'uppercase' }}
                >
                  Cargo / Ocupação
                </Typography>
                <Typography sx={{ color: textMain }}>
                  {user.occupation || '—'}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: textSecondary, textTransform: 'uppercase' }}
                >
                  Data de admissão
                </Typography>
                <Typography sx={{ color: textMain }}>
                  {user.hiredAt ? formatDate(user.hiredAt) : '—'}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: textSecondary, textTransform: 'uppercase' }}
                >
                  Dias de férias disponíveis
                </Typography>
                <Typography sx={{ color: textMain }}>
                  {user.availableVacationDays}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
