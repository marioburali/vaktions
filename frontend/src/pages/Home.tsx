import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Bem-vindo ao Dashboard
      </Typography>

      <Typography mb={4}>
        Aqui você verá as solicitações de reembolso, viagens, férias, etc.
      </Typography>

      <Button  variant="contained" color="error" onClick={logout}>
        Sair
      </Button>
    </Box>
  );
}
