import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Header from '../components/Header';
import ErrorModal from '../components/ErrorModal';
import RejectModal from '../components/RejectModal';
import { useModal } from '../hooks/useModal';

import { approveVacation, rejectVacation } from '../services/vacations';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

type VacationStatus = 'pending' | 'approved' | 'rejected' | 'completed';

type Vacation = {
  id: number;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    availableVacationDays?: number;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  status: VacationStatus;
  requestedAt: string;
  approvedAt?: string | null;
  notes?: string | null;
};

type LocationState = {
  vacation?: Vacation;
};

export default function VacationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [vacation, setVacation] = useState<Vacation | null>(
    state?.vacation ?? null
  );
  const [submitting, setSubmitting] = useState(false);
  const errorModal = useModal<string>();
  const [rejectOpen, setRejectOpen] = useState(false);

  // 🌙 Tema centralizado
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  const statusColor = (status: VacationStatus) => {
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

  const handleApprove = async () => {
    if (!vacation) return;

    try {
      setSubmitting(true);
      const updated = await approveVacation(vacation.id);
      setVacation(updated);
    } catch (err: any) {
      errorModal.openModal(err.message || 'Erro ao aprovar solicitação');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmReject = async (notes: string) => {
    if (!vacation) return;

    try {
      setSubmitting(true);
      const updated = await rejectVacation(vacation.id, notes.trim());
      setVacation(updated);
      setRejectOpen(false);
    } catch (err: any) {
      errorModal.openModal(err.message || 'Erro ao rejeitar solicitação');
    } finally {
      setSubmitting(false);
    }
  };

  const showNotFound = !vacation;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.bg }}>
      <Header />

      <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
        {/* Header da página */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ color: theme.textMain }}
            >
              Detalhes da solicitação
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: theme.textSecondary, mt: 0.5 }}
            >
              Solicitação #{vacation?.id ?? id}
            </Typography>
          </Box>

          <Button variant="outlined" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </Box>

        {/* Not found */}
        {showNotFound && (
          <Typography sx={{ color: theme.textSecondary }}>
            Solicitação não encontrada. Volte para a lista e tente novamente.
          </Typography>
        )}

        {/* Conteúdo */}
        {vacation && (
          <Paper
            sx={{
              backgroundColor: theme.cardBg,
              borderRadius: 3,
              border: `1px solid ${theme.border}`,
              p: 3,
            }}
          >
            <Stack spacing={2}>
              {/* Usuário + Status */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.textSecondary }}
                  >
                    Colaborador
                  </Typography>
                  <Typography sx={{ color: theme.textMain }}>
                    {vacation.user?.name ?? `Usuário #${vacation.userId}`}
                  </Typography>
                  {vacation.user?.email && (
                    <Typography
                      variant="body2"
                      sx={{ color: theme.textSecondary, mt: 0.5 }}
                    >
                      {vacation.user.email}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.textSecondary }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={vacation.status}
                    color={statusColor(vacation.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Infos principais */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.textSecondary }}
                  >
                    Período
                  </Typography>
                  <Typography sx={{ color: theme.textMain }}>
                    {vacation.startDate} — {vacation.endDate}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.textSecondary }}
                  >
                    Total de dias
                  </Typography>
                  <Typography sx={{ color: theme.textMain }}>
                    {vacation.totalDays}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.textSecondary }}
                  >
                    Dias disponíveis
                  </Typography>
                  <Typography sx={{ color: theme.textMain }}>
                    {vacation.user?.availableVacationDays ?? '—'}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Datas */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.textSecondary }}
                  >
                    Solicitado em
                  </Typography>
                  <Typography sx={{ color: theme.textMain }}>
                    {vacation.requestedAt}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.textSecondary }}
                  >
                    Última decisão
                  </Typography>
                  <Typography sx={{ color: theme.textMain }}>
                    {vacation.approvedAt ?? '—'}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Observações */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.textSecondary }}
                >
                  Observações
                </Typography>
                <Typography sx={{ color: theme.textMain, mt: 0.5 }}>
                  {vacation.notes?.trim() || 'Nenhuma observação registrada.'}
                </Typography>
              </Box>

              <Divider />

              {/* Ações */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  disabled={submitting}
                  onClick={() => setRejectOpen(true)}
                >
                  Rejeitar
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  disabled={submitting}
                  onClick={handleApprove}
                >
                  Aprovar
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Box>

      <RejectModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleConfirmReject}
        loading={submitting}
        vacation={vacation || undefined}
      />

      <ErrorModal
        open={errorModal.open}
        message={errorModal.data ?? ''}
        onClose={errorModal.closeModal}
      />
    </Box>
  );
}
