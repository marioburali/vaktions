import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import type { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

type CardConfig = {
  key: string;
  title: string;
  description: string;
  path: string;
  onlyAdmin?: boolean;
};

const cards: CardConfig[] = [
  {
    key: 'manage-requests',
    title: 'Gerenciar solicitações',
    description: 'Aprove ou rejeite pedidos de férias dos colaboradores.',
    path: '/admin/requests',
    onlyAdmin: true,
  },
  {
    key: 'manage-users',
    title: 'Gerenciar usuários',
    description: 'Cadastre novos colaboradores e ajuste permissões.',
    path: '/users',
    onlyAdmin: true,
  },
  {
    key: 'my-requests',
    title: 'Minhas solicitações',
    description: 'Veja o histórico e o status das suas solicitações de férias.',
    path: '/vacations/me',
  },
  {
    key: 'my-data',
    title: 'Meus dados',
    description: 'Consulte seus dados, cargo e saldo de dias de férias.',
    path: '/me',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser(null);
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  const visibleCards = cards.filter((card) =>
    card.onlyAdmin ? isAdmin : true
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      <Header />

      <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: theme.textMain }}>
          Olá, {user?.name || 'colaborador(a)'}!
        </Typography>

        <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 4 }}>
          Seja bem-vindo ao melhor sistema de gerenciamento de férias do mundo.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {visibleCards.map((card) => (
            <Paper
              key={card.key}
              onClick={() => navigate(card.path)}
              sx={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: 3,
                p: 3,
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: theme.border,
                },
              }}
            >
              <Typography variant="h6" sx={{ color: theme.textMain }} fontWeight={600}>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                {card.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
