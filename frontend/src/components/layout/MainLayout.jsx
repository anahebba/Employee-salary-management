
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
        backgroundColor: '#f4f6fa',
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
          backgroundColor: '#f4f6fa',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
