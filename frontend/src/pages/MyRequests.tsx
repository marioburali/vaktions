import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';

import Header from '../components/Header';
import ErrorModal from '../components/ErrorModal';

import { createVacation, getVacationsByUser } from '../services/vacations';
import { formatDate } from '../utils/formatDate';
import CreateVacationModal from '../components/CreateVacationModal';

export default function MyRequests() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const bgColor = darkMode ? '#020617' : '#f3f4f6';
  const tableBg = darkMode ? '#0b1120' : '#ffffff';
  const textMain = darkMode ? '#e5e7eb' : '#0f172a';
  const textSecondary = darkMode ? '#cbd5f5' : '#4b5563';
  const borderColor = darkMode ? 'rgba(148,163,184,0.2)' : '#e5e7eb';
  const rowHoverBg = darkMode
    ? 'rgba(148,163,184,0.1)'
    : 'rgba(148,163,184,0.08)';

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getVacationsByUser();
      setVacations(data);
    } catch (err: any) {
      setErrorModal(err.message || 'Erro ao carregar solicitações');
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: bgColor }}>
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />

      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600} sx={{ color: textMain }}>
            Minhas solicitações de férias
          </Typography>

          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            Nova Solicitação
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && vacations.length === 0 && (
          <Typography sx={{ color: textSecondary }}>
            Você ainda não possui solicitações.
          </Typography>
        )}

        {!loading && vacations.length > 0 && (
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
                  <TableCell sx={{ color: textSecondary }}>Período</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Dias</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Status</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Motivo</TableCell>
                  <TableCell sx={{ color: textSecondary }}>
                    Atualizado em
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vacations.map((vac: any) => (
                  <TableRow
                    key={vac.id}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: rowHoverBg },
                    }}
                  >
                    <TableCell sx={{ color: textSecondary }}>
                      {formatDate(vac.startDate)} — {formatDate(vac.endDate)}
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

                    <TableCell sx={{ color: textSecondary }}>
                      {vac.notes || '—'}
                    </TableCell>
                    <TableCell sx={{ color: textSecondary }}>
                      {formatDate(vac.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      <CreateVacationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        loading={loading}
        onConfirm={async ({ startDate, endDate }) => {
          try {
            setLoading(true);
            await createVacation(startDate, endDate);
            setCreateOpen(false);
            loadData();
          } catch (e: any) {
            setErrorModal(e.message || 'Erro ao solicitar férias');
          } finally {
            setLoading(false);
          }
        }}
      />

      <ErrorModal
        open={!!errorModal}
        message={errorModal || ''}
        onClose={() => setErrorModal(null)}
      />
    </Box>
  );
}
