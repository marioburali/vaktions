import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

type Role = 'admin' | 'user';

type User = {
  name?: string;
  role?: Role;
};

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
    path: '/admin/users',
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

  const isAdmin = user?.role === 'admin';

  const visibleCards = cards.filter((card) =>
    card.onlyAdmin ? isAdmin : true,
  );

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const bgColor = darkMode ? '#020617' : '#f3f4f6';
  const cardBg = darkMode ? '#0b1120' : '#ffffff';
  const cardBorder = darkMode
    ? '1px solid rgba(148,163,184,0.3)'
    : '1px solid #e5e7eb';
  const titleColor = darkMode ? '#e5e7eb' : '#0f172a';
  const textColor = darkMode ? '#cbd5f5' : '#4b5563';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: bgColor }}>
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          color: titleColor,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Olá, {user?.name || 'colaborador(a)'}
            </Typography>
            <Typography variant="body2" sx={{ color: textColor, mt: 0.5 }}>
              Aqui você gerencia solicitações de férias e dados dos colaboradores.
            </Typography>
            {isAdmin && (
              <Typography
                variant="caption"
                sx={{ color: textColor, mt: 0.5 }}
              >
                Você está logado como <strong>admin</strong>.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
            },
            gap: 3,
          }}
        >
          {visibleCards.map((card) => (
            <Paper
              key={card.key}
              onClick={() => handleCardClick(card.path)}
              sx={{
                backgroundColor: cardBg,
                border: cardBorder,
                borderRadius: 3,
                p: 3,
                cursor: 'pointer',
                transition:
                  'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                boxShadow: darkMode
                  ? '0 10px 30px rgba(15,23,42,0.6)'
                  : '0 8px 20px rgba(15,23,42,0.1)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: darkMode
                    ? '0 16px 40px rgba(15,23,42,0.8)'
                    : '0 12px 30px rgba(15,23,42,0.18)',
                  borderColor: darkMode
                    ? 'rgba(129,140,248,0.8)'
                    : 'rgba(59,130,246,0.8)',
                },
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                mb={1}
                sx={{ color: textColor }}
              >
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ color: textColor }}>
                {card.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
