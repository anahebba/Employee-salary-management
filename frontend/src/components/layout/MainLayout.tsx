import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: '72px',
          minWidth: 0,
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar sx={{ display: 'none' }} />
        <Outlet />
      </Box>
    </Box>
  );
}
