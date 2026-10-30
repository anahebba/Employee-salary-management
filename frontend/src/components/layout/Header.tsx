import { AccountCircleOutlined } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/employees': 'Employees',
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
        width: 'calc(100% - 250px)',
        ml: '250px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '72px' }}>
        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'right' }}>
            
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
  HR Manager
</Typography>
            <Typography variant="caption" color="text.secondary">
              ACME Organization
            </Typography>
          </Box>

          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <AccountCircleOutlined />
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
