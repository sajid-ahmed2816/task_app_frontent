import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

import "./App.css"

function App() {
  const { control, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://taskappbackend-production-f043.up.railway.app/api/pdf/generate', data, {
        responseType: 'blob', // receive PDF as blob
        headers: {
          'Content-Type': 'application/json', // explicitly tell it's JSON you're sending
        },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "file.pdf";
      link.target = "_blank";
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      setSnackbar({
        open: true,
        message: 'Document downloaded successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Failed to download document',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: "100%", display: "flex", alignItems: "center" }}>
      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          justifyContent: "center"
        }}
      >
        <Grid size={12}>
          <Typography variant="h4" gutterBottom>
            Property Document Generator
          </Typography>
        </Grid>
        <Grid size={12}>
          <Controller
            name="fullName"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => <TextField fullWidth={true} {...field} label="Full Name" required />}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => <TextField fullWidth={true} {...field} label="Address" required />}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="date"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => <TextField fullWidth={true} {...field} type="date" label="Date" InputLabelProps={{ shrink: true }} required />}
          />
        </Grid>
        <Grid size={12}>
          <Controller
            name="price"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => <TextField fullWidth={true} {...field} type="number" label="Price" required />}
          />
        </Grid>
        <Grid size={12}>
          <Button fullWidth type="submit" variant="contained">
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Document'}
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="outlined">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default App
