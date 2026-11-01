
import { AccountCircleOutlined } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/employees': 'Employee Management',
  '/salary-management': 'Salary Management',
  '/reports': 'Reports',
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'Salary Management';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        width: { xs: '100%', md: 'calc(100% - 250px)' },
        ml: { xs: 0, md: '250px' },
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: '72px',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight={700}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" fontWeight={600}>
              HR Manager
            </Typography>

            <Typography variant="caption" color="text.secondary">
              ACME Organization
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            <AccountCircleOutlined />
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
