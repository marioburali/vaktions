import { useCallback, useEffect, useState } from 'react';
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
import { useModal } from '../hooks/useModal';
import type { Vacation, VacationStatus } from '../types';

type ChipColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

export default function VacationList() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const navigate = useNavigate();
  const rejectModal = useModal<Vacation>();
  const errorModal = useModal<string>();
  const { openModal: openErrorModal } = errorModal;

  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllVacations();
      setVacations(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao carregar solicitações';
      openErrorModal(msg);
    } finally {
      setLoading(false);
    }
  }, [openErrorModal]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const statusColor = (status: VacationStatus): ChipColor => {
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

  const handleApprove = async (vac: Vacation) => {
    try {
      setSubmittingId(vac.id);
      await approveVacation(vac.id);
      await loadData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao aprovar solicitação';
      openErrorModal(msg);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleConfirmReject = async (notes: string) => {
    const vac = rejectModal.data;
    if (!vac) return;

    try {
      setSubmittingId(vac.id);
      await rejectVacation(vac.id, notes.trim());
      await loadData();
      rejectModal.closeModal();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao rejeitar solicitação';
      openErrorModal(msg);
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
                {vacations.map((vac) => {
                  const isSubmitting = submittingId === vac.id;

                  return (
                    <TableRow
                      key={vac.id}
                      hover
                      sx={{
                        // ✅ hover funcionando mesmo com TableCell
                        '&:hover td, &:hover th': {
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
                          onClick={() => rejectModal.openModal(vac)}
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
        open={rejectModal.open}
        onClose={rejectModal.closeModal}
        onConfirm={handleConfirmReject}
        loading={submittingId !== null}
        vacation={
          rejectModal.data && rejectModal.data.userId
            ? {
                id: rejectModal.data.id,
                userId: rejectModal.data.userId,
                user: rejectModal.data.user ?? undefined,
                startDate: rejectModal.data.startDate,
                endDate: rejectModal.data.endDate,
                notes: rejectModal.data.notes,
              }
            : undefined
        }
      />

      <ErrorModal
        open={errorModal.open}
        message={errorModal.data ?? ''}
        onClose={errorModal.closeModal}
      />
    </Box>
  );
}
