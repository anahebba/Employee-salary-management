import {
  DashboardOutlined,
  GroupsOutlined,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 250;

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <DashboardOutlined />,
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: <GroupsOutlined />,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="primary">
          ACME
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Salary Management
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 2, py: 2 }}>
        {navigationItems.map((item) => {
          const selected = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                },
                '&.Mui-selected .MuiListItemIcon-root': {
                  color: '#2563EB',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
