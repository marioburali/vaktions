import { useEffect, useMemo, useState } from 'react';
import { type MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Switch,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode,
  LightMode,
  Logout,
  DashboardOutlined,
  BeachAccessOutlined,
  GroupOutlined,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';

type Role = 'admin' | 'user';

type User = {
  name?: string;
  email?: string;
  role?: Role;
};

type AppHeaderProps = {
  darkMode: boolean;
  onToggleDarkMode: () => void;
};

export default function Header({ darkMode, onToggleDarkMode }: AppHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);
  const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser(null);
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  const navItems = useMemo(
    () =>
      [
        {
          label: 'Home',
          path: '/home',
          icon: <DashboardOutlined fontSize="small" />,
          adminOnly: false,
        },
        {
          label: 'Gerenciar Solicitações',
          path: '/admin/requests',
          icon: <CalendarMonthOutlined fontSize="small" />,
          adminOnly: true,
        },
        {
          label: 'Minhas Solicitações',
          path: '/vacations/me',
          icon: <BeachAccessOutlined fontSize="small" />,
          adminOnly: false,
        },
        {label: 'Usuários',
          path: '/users',
          icon: <GroupOutlined fontSize="small" />,
          adminOnly: true,          
        }
      ].filter((item) => (item.adminOnly ? isAdmin : true)),
    [isAdmin],
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const initials = useMemo(() => {
    if (!user?.name) return '?';
    const parts = user.name.split(' ');
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [user?.name]);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorUser(null);
  };

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorNav(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: darkMode ? 'rgba(15,23,42,0.95)' : '#ffffff',
        borderBottom: darkMode
          ? '1px solid rgba(148,163,184,0.3)'
          : '1px solid #e5e7eb',
        color: darkMode ? '#e5e7eb' : '#0f172a',
        backdropFilter: 'blur(16px)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 0.5, cursor: 'pointer' }}
            onClick={() => navigate('/home')}
          >
            VaKtions
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => handleNavigate(item.path)}
              sx={{
                textTransform: 'none',
                fontSize: 14,
                borderRadius: 999,
                px: 2,
                color: isActive(item.path)
                  ? darkMode
                    ? '#e5e7eb'
                    : '#0f172a'
                  : darkMode
                  ? '#cbd5f5'
                  : '#4b5563',
                backgroundColor: isActive(item.path)
                  ? darkMode
                    ? 'rgba(129,140,248,0.25)'
                    : 'rgba(59,130,246,0.12)'
                  : 'transparent',
              }}
            >
              {item.label}
            </Button>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton size="small" onClick={onToggleDarkMode}>
              {darkMode ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
            </IconButton>
            <Switch
              checked={darkMode}
              onChange={onToggleDarkMode}
              size="small"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorNav}
              open={Boolean(anchorNav)}
              onClose={handleCloseNavMenu}
              keepMounted
            >
              {navItems.map((item) => (
                <MenuItem key={item.path} onClick={() => handleNavigate(item.path)}>
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem onClick={onToggleDarkMode}>
                {darkMode ? 'Modo claro' : 'Modo escuro'}
              </MenuItem>
            </Menu>
          </Box>

          {/* Usuário */}
          <Tooltip title={user?.email || ''}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: darkMode ? '#4f46e5' : '#3b82f6',
                  fontSize: 14,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorUser}
            open={Boolean(anchorUser)}
            onClose={handleCloseUserMenu}
            keepMounted
          >
            <MenuItem disabled>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2">{user?.name || 'Usuário'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/me')}>
              Meu perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" style={{ marginRight: 8 }} />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
