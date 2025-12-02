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

import {
  getAllVacations,
  approveVacation,
  rejectVacation,
} from '../services/vacations';

import Header from '../components/Header';
import RejectModal from '../components/RejectModal';

export default function VacationList() {
  const [vacations, setVacations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [rejectOpen, setRejectOpen] = useState(false);
  const [vacationToReject, setVacationToReject] = useState<any | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

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
      setError('');
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
      case 'completed':
        return 'default';
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

  const handleApprove = async (vac: any) => {
    try {
      setSubmittingId(vac.id);
      setError('');
      await approveVacation(vac.id);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao aprovar solicitação');
    } finally {
      setSubmittingId(null);
    }
  };

  const openRejectModal = (vac: any) => {
    setVacationToReject(vac);
    setRejectOpen(true);
  };

  const closeRejectModal = () => {
    setRejectOpen(false);
    setVacationToReject(null);
  };

  const handleConfirmReject = async (notes: string) => {
    if (!vacationToReject) return;

    try {
      setSubmittingId(vacationToReject.id);
      await rejectVacation(vacationToReject.id, notes.trim() || undefined);
      await loadData();
      closeRejectModal();
    } catch (err: any) {
      setError(err.message || 'Erro ao rejeitar solicitação');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: bgColor }}>
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />

      <Box sx={{ p: 4 }}>
        <Typography
          variant="h5"
          fontWeight={600}
          mb={1.5}
          sx={{ color: textMain }}
        >
          Gerenciar solicitações de férias
        </Typography>

        {error && !loading && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="inherit" />
          </Box>
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
                  <TableCell sx={{ color: textSecondary }}>
                    Dias Disponíveis
                  </TableCell>
                  <TableCell sx={{ color: textSecondary }}>Status</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vacations.map((vac: any) => {
                  const isSubmitting = submittingId === vac.id;

                  return (
                    <TableRow
                      key={vac.id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: rowHoverBg,
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

                      <TableCell sx={{ color: textSecondary }}>
                        {vac.user?.availableVacationDays ?? '—'}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={vac.status}
                          color={statusColor(vac.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          display: 'flex',
                          gap: 1,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Button
                          variant="text"
                          size="small"
                          sx={{ color: textSecondary }}
                          onClick={() => navigate(`/admin/requests/${vac.id}`)}
                        >
                          Detalhes
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          disabled={isSubmitting}
                          sx={{
                            borderColor: borderColor,
                            color: textSecondary,
                          }}
                          onClick={() => handleApprove(vac)}
                        >
                          Aprovar
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          disabled={isSubmitting}
                          sx={{
                            borderColor: borderColor,
                            color: textSecondary,
                          }}
                          onClick={() => openRejectModal(vac)}
                        >
                          Rejeitar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      {/* modal */}
      <RejectModal
        open={rejectOpen}
        onClose={closeRejectModal}
        onConfirm={handleConfirmReject}
        loading={submittingId !== null}
        vacation={vacationToReject}
      />
    </Box>
  );
}
