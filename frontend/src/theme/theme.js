
import { createTheme } from '@mui/material/styles';

const chartColors = {
  terracotta: '#A96F62',
  sage: '#829B8D',
  dustyBlue: '#858EAD',
  ochre: '#BD9A68',
};

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: chartColors.terracotta,
      light: '#F2E6E2',
      dark: '#875448',
    },

    secondary: {
      main: chartColors.dustyBlue,
      light: '#E9EBF3',
      dark: '#626B8C',
    },

    success: {
      main: chartColors.sage,
      light: '#E8EFEB',
      dark: '#617C6E',
    },

    warning: {
      main: chartColors.ochre,
      light: '#F4EDDF',
      dark: '#967444',
    },

    error: {
      main: '#B66F70',
      light: '#F4E8E7',
      dark: '#925657',
    },

    background: {
      default: '#F7F4F0',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#393631',
      secondary: '#77716B',
    },

    divider: '#E9E2DC',

    chart: chartColors,
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
          border: '1px solid #E9E2DC',
          boxShadow: '0 2px 8px rgba(57, 54, 49, 0.035)',
          transition: 'box-shadow 0.2s ease',

          '&:hover': {
            boxShadow: '0 5px 16px rgba(57, 54, 49, 0.07)',
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
