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
import { approveVacation, rejectVacation } from '../services/vacations';

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
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

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

  const bgColor = darkMode ? '#020617' : '#f3f4f6';
  const cardBg = darkMode ? '#0b1120' : '#ffffff';
  const titleColor = darkMode ? '#e5e7eb' : '#0f172a';
  const textColor = darkMode ? '#cbd5f5' : '#4b5563';
  const borderColor = darkMode ? 'rgba(148,163,184,0.2)' : '#e5e7eb';

  const handleApprove = async () => {
    if (!vacation) return;

    try {
      setSubmitting(true);
      const updated = await approveVacation(vacation.id);
      setVacation(updated);
    } catch (err: any) {
      setErrorModal(err.message || 'Erro ao aprovar solicitação');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReject = () => {
    if (!vacation) return;
    setRejectOpen(true);
  };

  const handleCloseReject = () => {
    setRejectOpen(false);
  };

  const handleConfirmReject = async (notes: string) => {
    if (!vacation) return;

    try {
      setSubmitting(true);
      const updated = await rejectVacation(vacation.id, notes.trim());
      setVacation(updated);
      setRejectOpen(false);
    } catch (err: any) {
      setErrorModal(err.message || 'Erro ao rejeitar solicitação');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const showNotFound = !vacation;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: bgColor }}>
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />

      <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
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
              sx={{ color: titleColor }}
            >
              Detalhes da solicitação
            </Typography>
            {vacation && (
              <Typography variant="body2" sx={{ color: textColor, mt: 0.5 }}>
                Solicitação #{vacation.id}
              </Typography>
            )}
            {!vacation && id && (
              <Typography variant="body2" sx={{ color: textColor, mt: 0.5 }}>
                Solicitação #{id}
              </Typography>
            )}
          </Box>

          <Button variant="outlined" onClick={handleBack}>
            Voltar
          </Button>
        </Box>

        {!vacation && (
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ color: textColor }}>
              Solicitação não encontrada. Volte para a lista e tente novamente.
            </Typography>
          </Box>
        )}

        {vacation && (
          <Paper
            sx={{
              backgroundColor: cardBg,
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              p: 3,
            }}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ color: textColor }}>
                    Colaborador
                  </Typography>
                  <Typography variant="body1" sx={{ color: titleColor }}>
                    {vacation.user?.name ?? `Usuário #${vacation.userId}`}
                  </Typography>
                  {vacation.user?.email && (
                    <Typography
                      variant="body2"
                      sx={{ color: textColor, mt: 0.5 }}
                    >
                      {vacation.user.email}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="subtitle2" sx={{ color: textColor }}>
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

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ color: textColor }}>
                    Período
                  </Typography>
                  <Typography variant="body1" sx={{ color: titleColor }}>
                    {vacation.startDate} — {vacation.endDate}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: textColor }}>
                    Total de dias
                  </Typography>
                  <Typography variant="body1" sx={{ color: titleColor }}>
                    {vacation.totalDays}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: textColor }}>
                    Dias disponíveis
                  </Typography>
                  <Typography variant="body1" sx={{ color: titleColor }}>
                    {vacation.user?.availableVacationDays ?? '—'}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ color: textColor }}>
                    Solicitado em
                  </Typography>
                  <Typography variant="body2" sx={{ color: titleColor }}>
                    {vacation.requestedAt}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: textColor }}>
                    Última decisão
                  </Typography>
                  <Typography variant="body2" sx={{ color: titleColor }}>
                    {vacation.approvedAt ?? '—'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: textColor }}>
                  Observações
                </Typography>
                <Typography variant="body2" sx={{ color: titleColor, mt: 0.5 }}>
                  {vacation.notes && vacation.notes.trim() !== ''
                    ? vacation.notes
                    : 'Nenhuma observação registrada.'}
                </Typography>
              </Box>

              <Divider />

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  disabled={submitting || showNotFound}
                  onClick={handleOpenReject}
                >
                  Rejeitar
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  disabled={submitting || showNotFound}
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
        onClose={handleCloseReject}
        onConfirm={handleConfirmReject}
        loading={submitting}
        vacation={vacation || undefined}
      />

      <ErrorModal
        open={!!errorModal}
        message={errorModal || ''}
        onClose={() => setErrorModal(null)}
      />
    </Box>
  );
}
