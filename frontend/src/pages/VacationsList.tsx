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
import ErrorModal from '../components/ErrorModal';

import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

export default function VacationList() {
  const [vacations, setVacations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [vacationToReject, setVacationToReject] = useState<any | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const [errorModal, setErrorModal] = useState<string | null>(null);

  const navigate = useNavigate();

  // 🌙 Tema centralizado
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getAllVacations();
      setVacations(data);
    } catch (err: any) {
      setErrorModal(err.message || 'Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  }

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

  const handleApprove = async (vac: any) => {
    try {
      setSubmittingId(vac.id);
      await approveVacation(vac.id);
      await loadData();
    } catch (err: any) {
      setErrorModal(err.message || 'Erro ao aprovar solicitação');
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
      await rejectVacation(vacationToReject.id, notes.trim());
      await loadData();
      closeRejectModal();
    } catch (err: any) {
      setErrorModal(err.message || 'Erro ao rejeitar solicitação');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      <Header />

      <Box sx={{ p: 4 }}>
        <Typography
          variant="h5"
          fontWeight={600}
          mb={1.5}
          sx={{ color: theme.textMain }}
        >
          Gerenciar solicitações de férias
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {!loading && vacations.length === 0 && (
          <Typography mt={2} sx={{ color: theme.textSecondary }}>
            Nenhuma solicitação encontrada.
          </Typography>
        )}

        {!loading && vacations.length > 0 && (
          <Paper
            sx={{
              backgroundColor: theme.tableBg,
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${theme.border}`,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Colaborador
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Período
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Dias
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Dias Disponíveis
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vacations.map((vac: any) => {
                  const isSubmitting = submittingId === vac.id;

                  return (
                    <TableRow
                      key={vac.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.rowHover,
                        },
                      }}
                    >
                      <TableCell sx={{ color: theme.textSecondary }}>
                        {vac.user?.name ?? `Usuário #${vac.userId}`}
                      </TableCell>

                      <TableCell sx={{ color: theme.textSecondary }}>
                        {vac.startDate} — {vac.endDate}
                      </TableCell>

                      <TableCell sx={{ color: theme.textSecondary }}>
                        {vac.totalDays}
                      </TableCell>

                      <TableCell sx={{ color: theme.textSecondary }}>
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
                        sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
                      >
                        <Button
                          variant="text"
                          size="small"
                          sx={{ color: theme.textSecondary }}
                          onClick={() =>
                            navigate(`/admin/requests/${vac.id}`, {
                              state: { vacation: vac },
                            })
                          }
                        >
                          Detalhes
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          disabled={isSubmitting}
                          sx={{
                            borderColor: theme.border,
                            color: theme.textSecondary,
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
                            borderColor: theme.border,
                            color: theme.textSecondary,
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

      <RejectModal
        open={rejectOpen}
        onClose={closeRejectModal}
        onConfirm={handleConfirmReject}
        loading={submittingId !== null}
        vacation={vacationToReject}
      />

      <ErrorModal
        open={!!errorModal}
        message={errorModal || ''}
        onClose={() => setErrorModal(null)}
      />
    </Box>
  );
}
