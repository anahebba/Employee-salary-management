
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#2563EB',
      light: '#EFF6FF',
      dark: '#1D4ED8',
    },

    secondary: {
      main: '#64748B',
    },

    success: {
      main: '#16A34A',
    },

    warning: {
      main: '#EA580C',
    },

    background: {
      default: '#F4F6FA',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',

    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          transition: 'box-shadow 0.2s ease',

          '&:hover': {
            boxShadow: '0 5px 16px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
