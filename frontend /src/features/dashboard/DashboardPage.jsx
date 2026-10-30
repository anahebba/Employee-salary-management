import { Box, Typography } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Typography color="text.secondary">
        Welcome to ACME Salary Management.
        Your organization-wide salary insights will appear here.
      </Typography>
    </Box>
  );
}
