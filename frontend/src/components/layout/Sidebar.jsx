
import {
  DashboardOutlined,
  GroupsOutlined,
   PaymentsOutlined,
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
  {
  label: 'Salary Management',
  path: '/salary-management',
  icon: <PaymentsOutlined />,
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
      {/* Brand section */}
      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          color="primary.main"
          letterSpacing={1}
        >
          ACME
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ letterSpacing: 0.5 }}
        >
          PEOPLE & PAYROLL
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ px: 2, py: 3 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ px: 2, fontWeight: 700 }}
        >
          WORKSPACE
        </Typography>

        <List sx={{ mt: 1 }}>
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
                  py: 1.3,
                  transition: 'all 0.2s ease',

                  '&:hover': {
                    backgroundColor: '#F1F5F9',
                  },

                  '&.Mui-selected': {
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    fontWeight: 700,
                  },

                  '&.Mui-selected:hover': {
                    backgroundColor: '#DBEAFE',
                  },

                  '&.Mui-selected .MuiListItemIcon-root': {
                    color: '#2563EB',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: selected ? '#2563EB' : '#64748B',
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: selected ? 700 : 500,
                    fontSize: 14,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Footer */}
      <Divider />

      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="caption" color="text.secondary">
          ACME Salary Management
        </Typography>

        <Typography
          variant="caption"
          display="block"
          color="text.disabled"
        >
          HR Administration Portal
        </Typography>
      </Box>
    </Drawer>
  );
}
