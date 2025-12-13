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
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Header from '../components/Header';
import ErrorModal from '../components/ErrorModal';
import UserModal from '../components/UserModal';
import DeleteUserModal from '../components/DeleteUserModal';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/users';
import { formatDate } from '../utils/formatDate';
import type { User, UserFormMode } from '../types';

// type Role = 'admin' | 'user';

// export type User = {
//   id: number;
//   name: string;
//   email: string;
//   role: Role;
//   occupation: string;
//   hiredAt: string | null;
//   availableVacationDays: number;
// };

// type UserFormData = {
//   name: string;
//   email: string;
//   role: Role;
//   occupation: string;
//   hiredAt: string;
//   password?: string;
// };

// type UserFormMode = 'create' | 'edit';

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<UserFormMode>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userModalSubmitting, setUserModalSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setErrorModalMessage('');
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setErrorModalMessage(err.message || 'Erro ao carregar usuários');
      setErrorModalOpen(true);
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

  const handleOpenCreate = () => {
    setUserModalMode('create');
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserModalMode('edit');
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    if (userModalSubmitting) return;
    setUserModalOpen(false);
  };

  const handleSubmitUser = async (formData: UserFormData) => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.occupation.trim() ||
      !formData.hiredAt
    ) {
      setErrorModalMessage('Preencha todos os campos obrigatórios.');
      setErrorModalOpen(true);
      return;
    }

    if (userModalMode === 'create' && !formData.password?.trim()) {
      setErrorModalMessage('Defina uma senha para o novo usuário.');
      setErrorModalOpen(true);
      return;
    }

    const payload: any = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      occupation: formData.occupation.trim(),
      hiredAt: formData.hiredAt,
    };

    if (formData.password?.trim()) {
      payload.password = formData.password.trim();
    }

    try {
      setUserModalSubmitting(true);

      if (userModalMode === 'create') {
        await createUser(payload);
      } else if (userModalMode === 'edit' && selectedUser) {
        await updateUser(selectedUser.id, payload);
      }

      await loadData();
      setUserModalOpen(false);
    } catch (err: any) {
      setErrorModalMessage(err.message || 'Erro ao salvar usuário');
      setErrorModalOpen(true);
    } finally {
      setUserModalSubmitting(false);
    }
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    if (deleteSubmitting) return;
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleteSubmitting(true);
      await deleteUser(userToDelete.id);
      await loadData();
      handleCloseDelete();
    } catch (err: any) {
      setErrorModalMessage(err.message || 'Erro ao excluir usuário');
      setErrorModalOpen(true);
    } finally {
      setDeleteSubmitting(false);
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
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600} sx={{ color: textMain }}>
              Gerenciar usuários
            </Typography>
            <Typography variant="body2" sx={{ color: textSecondary }}>
              Cadastre, edite ou remova colaboradores do sistema.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Novo usuário
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {!loading && users.length === 0 && (
          <Typography mt={2} sx={{ color: textSecondary }}>
            Nenhum usuário encontrado.
          </Typography>
        )}

        {!loading && users.length > 0 && (
          <Paper
            sx={{
              backgroundColor: tableBg,
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${borderColor}`,
              mt: 2,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: textSecondary }}>Nome</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Email</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Cargo</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Admissão</TableCell>
                  <TableCell sx={{ color: textSecondary }}>
                    Dias de férias
                  </TableCell>
                  <TableCell sx={{ color: textSecondary }}>Perfil</TableCell>
                  <TableCell sx={{ color: textSecondary }}>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: rowHoverBg,
                      },
                    }}
                  >
                    <TableCell sx={{ color: textSecondary }}>
                      {user.name}
                    </TableCell>
                    <TableCell sx={{ color: textSecondary }}>
                      {user.email}
                    </TableCell>
                    <TableCell sx={{ color: textSecondary }}>
                      {user.occupation}
                    </TableCell>
                    <TableCell sx={{ color: textSecondary }}>
                      {user.hiredAt ? formatDate(user.hiredAt) : '—'}
                    </TableCell>
                    <TableCell sx={{ color: textSecondary }}>
                      {user.availableVacationDays}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'admin' ? 'primary' : 'success'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(user)}
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: textSecondary }}
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDelete(user)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      <UserModal
        open={userModalOpen}
        mode={userModalMode}
        user={selectedUser}
        loading={userModalSubmitting}
        onClose={handleCloseUserModal}
        onConfirm={handleSubmitUser}
      />

      <DeleteUserModal
        open={deleteModalOpen}
        user={userToDelete}
        loading={deleteSubmitting}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />

      <ErrorModal
        open={errorModalOpen}
        message={errorModalMessage}
        onClose={() => setErrorModalOpen(false)}
      />
    </Box>
  );
}
