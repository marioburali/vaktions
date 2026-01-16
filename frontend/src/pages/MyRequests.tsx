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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EditOutlined } from '@mui/icons-material';

import {
  createVacation,
  deleteVacation,
  getVacationsByUser,
} from '../services/vacations';

import { formatDate } from '../utils/formatDate';
import CreateVacationModal from '../components/CreateVacationModal';
import DeleteVacationModal from '../components/DeleteRequestVacationModal';
import { useModal } from '../hooks/useModal';
import type { Vacation } from '../types/vacation';

import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

export default function MyRequests() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const errorModal = useModal<string>();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState<Vacation | null>(null);

  // 🌙 Tema centralizado
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await getVacationsByUser();
      setVacations(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar solicitações';
      errorModal.openModal(message);
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

  async function handleDelete() {
    if (!selectedVacation) return;

    try {
      setLoading(true);
      await deleteVacation(selectedVacation.id);
      setDeleteOpen(false);
      await loadData();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao excluir solicitação';
      errorModal.openModal(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      <Header />

      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ color: theme.textMain }}
          >
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
          <Typography sx={{ color: theme.textSecondary }}>
            Você ainda não possui solicitações.
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
                    Período
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Dias
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Motivo
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Atualizado em
                  </TableCell>
                  <TableCell sx={{ color: theme.textSecondary }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vacations.map((vac) => (
                  <TableRow
                    key={vac.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.rowHover,
                      },
                    }}
                  >
                    <TableCell sx={{ color: theme.textSecondary }}>
                      {formatDate(vac.startDate)} — {formatDate(vac.endDate)}
                    </TableCell>

                    <TableCell sx={{ color: theme.textSecondary }}>
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

                    <TableCell sx={{ color: theme.textSecondary }}>
                      {vac.notes || '—'}
                    </TableCell>

                    <TableCell sx={{ color: theme.textSecondary }}>
                      {formatDate(vac.updatedAt)}
                    </TableCell>

                    <TableCell>
                      <EditOutlined
                        sx={{
                          cursor: 'pointer',
                          mr: 2,
                          transition: '0.2s',
                          color: theme.textSecondary,
                          '&:hover': {
                            color: theme.textMain,
                            transform: 'scale(1.1)',
                          },
                        }}
                        onClick={() => {
                          // edição futura
                        }}
                      />

                      <DeleteOutlineIcon
                        sx={{
                          cursor: 'pointer',
                          color: theme.error,
                          transition: '0.2s',
                          '&:hover': {
                            color: theme.errorHover,
                            transform: 'scale(1.1)',
                          },
                        }}
                        onClick={() => {
                          setSelectedVacation(vac);
                          setDeleteOpen(true);
                        }}
                      />
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
            await loadData();
          } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Ops! Erro ao solicitar férias';
            errorModal.openModal(message);
          } finally {
            setLoading(false);
          }
        }}
      />

      <DeleteVacationModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
        vacation={selectedVacation}
      />

      <ErrorModal
        open={errorModal.open}
        message={errorModal.data ?? ''}
        onClose={errorModal.closeModal}
      />
    </Box>
  );
}
