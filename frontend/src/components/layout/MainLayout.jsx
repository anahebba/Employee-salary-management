
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Sidebar />

      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          mt: '72px',
          p: { xs: 2, sm: 3, lg: 4 },
          backgroundColor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
