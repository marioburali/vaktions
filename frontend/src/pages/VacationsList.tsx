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

export default function VacationList() {
  const [vacations, setVacations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        p: 4,
        color: '#e5e7eb',
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3}>
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
        <Typography mt={2}>Nenhuma solicitação encontrada.</Typography>
      )}

      {!loading && !error && vacations.length > 0 && (
        <Paper
          sx={{
            backgroundColor: '#0b1120',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(148,163,184,0.2)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#e2e8f0' }}>Colaborador</TableCell>
                <TableCell sx={{ color: '#e2e8f0' }}>Período</TableCell>
                <TableCell sx={{ color: '#e2e8f0' }}>Dias</TableCell>
                <TableCell sx={{ color: '#e2e8f0' }}>Status</TableCell>
                <TableCell sx={{ color: '#e2e8f0' }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {vacations.map((vac: any) => (
                <TableRow
                  key={vac.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(148,163,184,0.1)',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell sx={{ color: '#cbd5e1' }}>
                    {vac.user?.name}
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>
                    {vac.startDate} — {vac.endDate}
                  </TableCell>
                  <TableCell sx={{ color: '#cbd5e1' }}>
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
                      sx={{ borderColor: '#64748b', color: '#cbd5e1' }}
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
  );
}
