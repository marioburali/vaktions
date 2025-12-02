import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllVacations } from '../services/vacations';
import Header from '../components/Header';

export default function VacationList() {
  const [vacations, setVacations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getAllVacations();
      setVacations(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const bgColor = darkMode ? '#020617' : '#f3f4f6';
  const tableBg = darkMode ? '#0b1120' : '#ffffff';
  const textMain = darkMode ? '#e5e7eb' : '#0f172a';
  const textSecondary = darkMode ? '#cbd5f5' : '#4b5563';
  const borderColor = darkMode ? 'rgba(148,163,184,0.2)' : '#e5e7eb';
  const rowHoverBg = darkMode
    ? 'rgba(148,163,184,0.1)'
    : 'rgba(148,163,184,0.08)';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: bgColor }}>
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />

      <Box sx={{ p: 4 }}>
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
          sx={{ color: textMain }}
        >
          Gerenciar solicitações de férias
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {!loading && error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}

        {!loading && !error && vacations.length === 0 && (
          <Typography mt={2} sx={{ color: textSecondary }}>
            Nenhuma solicitação encontrada.
          </Typography>
        )}

        {!loading && !error && vacations.length > 0 && (
          <Paper
            sx={{
              backgroundColor: tableBg,
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${borderColor}`,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: textSecondary }}>
                    Colaborador
                  </TableCell>
                  <TableCell sx={{ color: textSecondary }}>Período</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Dias</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Status</TableCell>
                  <TableCell sx={{ color: textSecondary }}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vacations.map((vac: any) => (
                  <TableRow
                    key={vac.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: rowHoverBg,
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <TableCell sx={{ color: textSecondary }}>
                      {vac.user?.name ?? `Usuário #${vac.userId}`}
                    </TableCell>
                    <TableCell sx={{ color: textSecondary }}>
                      {vac.startDate} — {vac.endDate}
                    </TableCell>
                    <TableCell sx={{ color: textSecondary }}>
                      {vac.totalDays}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={vac.status}
                        color={statusColor(vac.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: borderColor,
                          color: textSecondary,
                        }}
                        onClick={() => navigate(`/admin/requests/${vac.id}`)}
                      >
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
