
import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import PlayArrowOutlined from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  deleteSavedReport,
  exportReport,
  getReportTemplates,
  getSavedReports,
  runReport,
  saveReport,
} from '../../api/reports';

const controlSx = {
  width: { xs: '100%', sm: 190 },
  '& .MuiInputBase-root': {
    height: 44,
  },
};

const templateSx = {
  width: { xs: '100%', sm: 240 },
  '& .MuiInputBase-root': {
    height: 44,
  },
};

export default function ReportsPage() {
  const [templates, setTemplates] = useState([]);
  const [saved, setSaved] = useState([]);

  const [type, setType] = useState('current_salary');
  const [country, setCountry] = useState('ALL');
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const [from, setFrom] = useState(
    `${new Date().getFullYear()}-01-01`
  );
  const [to, setTo] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [rows, setRows] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [page, setPage] = useState(0);
  const [saveOpen, setSaveOpen] = useState(false);
  const [reportName, setReportName] = useState('');

  const params = useMemo(
    () => ({
      type,
      country,
      department,
      status,
      search,
      from,
      to,
      columns: selectedColumns.join(',') || undefined,
    }),
    [
      type,
      country,
      department,
      status,
      search,
      from,
      to,
      selectedColumns,
    ]
  );

  const loadSaved = async () => {
    setSaved(await getSavedReports());
  };

  useEffect(() => {
    Promise.all([getReportTemplates(), getSavedReports()])
      .then(([templateData, savedData]) => {
        setTemplates(templateData);
        setSaved(savedData);
      })
      .catch(() => {
        setError('Unable to load report centre.');
      });
  }, []);

  const execute = async (nextParams = params) => {
    setLoading(true);
    setError('');

    try {
      setRows(await runReport(nextParams));
      setPage(0);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Unable to generate this report.'
      );
    } finally {
      setLoading(false);
    }
  };

  const download = async (format) => {
    try {
      const blob = await exportReport({ ...params, format });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = `acme-${type}.${format === 'xlsx' ? 'xlsx' : 'csv'}`;
      a.click();

      URL.revokeObjectURL(url);
    } catch {
      setError('Export failed. Please run the report again.');
    }
  };

  const handleSave = async () => {
    try {
      await saveReport({
        name: reportName,
        reportType: type,
        configuration: JSON.stringify({
          country,
          department,
          status,
          search,
          from,
          to,
          columns: selectedColumns,
        }),
      });

      setSaveOpen(false);
      setReportName('');

      await loadSaved();

      setNotice('Report configuration saved.');
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Unable to save report.'
      );
    }
  };

  const useSaved = (item) => {
    setType(item.reportType);

    try {
      const config =
        typeof item.configuration === 'string'
          ? JSON.parse(item.configuration)
          : item.configuration;

      const nextConfig = {
        country: config.country || 'ALL',
        department: config.department || 'ALL',
        status: config.status || 'ALL',
        search: config.search || '',
        from: config.from || from,
        to: config.to || to,
        columns: config.columns || [],
      };

      setCountry(nextConfig.country);
      setDepartment(nextConfig.department);
      setStatus(nextConfig.status);
      setSearch(nextConfig.search);
      setFrom(nextConfig.from);
      setTo(nextConfig.to);
      setSelectedColumns(nextConfig.columns);

      execute({
        type: item.reportType,
        ...nextConfig,
        columns: nextConfig.columns.join(',') || undefined,
      });
    } catch {
      setError('Saved report configuration could not be read.');
    }
  };

  const removeSaved = async (id) => {
    try {
      await deleteSavedReport(id);
      await loadSaved();
    } catch {
      setError('Unable to delete saved report.');
    }
  };

  const columns = rows.length ? Object.keys(rows[0]) : [];

  const visibleColumns = selectedColumns.length
    ? columns.filter((column) => selectedColumns.includes(column))
    : columns;

  return (
    <Box sx={{ pb: 4 }}>
      {/* PAGE HEADING */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Reports
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Build, filter, save and export HR and compensation reports.
        </Typography>
      </Box>

      {/* REPORT BUILDER */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1.5}
            sx={{ mb: 2.5 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Report builder
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Choose a template and apply the filters you need.
              </Typography>
            </Box>

            <Chip
              label={`${rows.length.toLocaleString()} rows`}
              color="primary"
              variant="outlined"
            />
          </Stack>

          {/* FILTERS */}
          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
          >
            <TextField
              select
              size="small"
              label="Report template"
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={templateSx}
            >
              {templates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              sx={controlSx}
            >
              <MenuItem value="ALL">All countries</MenuItem>
              {['India', 'USA', 'UK', 'Germany'].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              sx={{ ...controlSx, width: { xs: '100%', sm: 205 } }}
            >
              <MenuItem value="ALL">All departments</MenuItem>
              {[
                'Engineering',
                'Finance',
                'Human Resources',
                'Marketing',
              ].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            {type === 'employee_directory' && (
              <TextField
                select
                size="small"
                label="Employment status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={controlSx}
              >
                <MenuItem value="ALL">All statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </TextField>
            )}

            {type === 'employee_directory' && (
              <TextField
                size="small"
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={controlSx}
              />
            )}

            {type === 'salary_revisions' && (
              <TextField
                size="small"
                label="From"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={controlSx}
              />
            )}

            {type === 'salary_revisions' && (
              <TextField
                size="small"
                label="To"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={controlSx}
              />
            )}

            {columns.length > 0 && (
              <TextField
                select
                size="small"
                label="Visible columns"
                value={selectedColumns}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) =>
                    selected.length
                      ? `${selected.length} selected`
                      : 'All columns',
                }}
                onChange={(e) => setSelectedColumns(e.target.value)}
                helperText="Clear selection to show all"
                sx={{
                  ...controlSx,
                  width: { xs: '100%', sm: 190 },
                }}
              >
                {columns.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>

          {/* ACTION BUTTONS */}
          <Stack
            direction="row"
            spacing={1.25}
            useFlexGap
            flexWrap="wrap"
            alignItems="center"
            sx={{ mt: 2.5 }}
          >
            <Button
              size="medium"
              variant="contained"
              startIcon={<PlayArrowOutlined />}
              onClick={() => execute()}
            >
              Generate report
            </Button>

            <Button
              size="medium"
              variant="outlined"
              startIcon={<DownloadOutlined />}
              disabled={!rows.length}
              onClick={() => download('csv')}
            >
              Export CSV
            </Button>

            <Button
              size="medium"
              variant="outlined"
              startIcon={<DownloadOutlined />}
              disabled={!rows.length}
              onClick={() => download('xlsx')}
            >
              Export Excel
            </Button>

            <Button
              size="medium"
              variant="text"
              startIcon={<SaveOutlined />}
              disabled={!rows.length}
              onClick={() => setSaveOpen(true)}
            >
              Save configuration
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {notice && (
        <Alert
          severity="success"
          onClose={() => setNotice('')}
          sx={{ mb: 2 }}
        >
          {notice}
        </Alert>
      )}

      {/* REPORT PREVIEW */}
      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Report preview
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Generate a report to preview the matching records.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', p: 6 }}>
            <CircularProgress />
          </Box>
        ) : rows.length ? (
          <>
            <TableContainer sx={{ maxHeight: 520 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={column}
                        sx={{
                          fontWeight: 700,
                          bgcolor: '#F7F4F0',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows
                    .slice(page * 25, page * 25 + 25)
                    .map((row, index) => (
                      <TableRow hover key={index}>
                        {visibleColumns.map((column) => (
                          <TableCell
                            key={column}
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {row[column] == null
                              ? '—'
                              : String(row[column])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              rowsPerPage={25}
              rowsPerPageOptions={[25]}
            />
          </>
        ) : (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No preview data yet. Select a report and generate it.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* SAVED REPORTS */}
      <Paper
        sx={{
          mt: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Saved reports
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Reusable report templates and filters.
          </Typography>
        </Box>

        {saved.length ? (
          saved.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{
                px: 2.5,
                py: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={600}>
                  {item.name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.reportType.replaceAll('_', ' ')}
                </Typography>
              </Box>

              <Stack direction="row" spacing={0.5} alignItems="center">
                <Button size="small" onClick={() => useSaved(item)}>
                  Load
                </Button>

                <Button
                  color="error"
                  size="small"
                  onClick={() => removeSaved(item.id)}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </Stack>
            </Stack>
          ))
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No saved report configurations yet.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* SAVE REPORT DIALOG */}
      <Dialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Save report configuration</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Report name"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSaveOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={!reportName.trim()}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
