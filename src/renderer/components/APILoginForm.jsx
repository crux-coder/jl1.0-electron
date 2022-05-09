import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Container, Button, TextField, Typography } from '@mui/material';
import '../App.css';
import KeyIcon from '@mui/icons-material/Key';
import axios from 'axios';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function APILoginForm({ setUser }) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState(false);

  const login = () => {
    axios
      .post('http://localhost:3000/login', {
        apiKey,
      })
      .then(function (response) {
        localStorage.setItem('user', JSON.stringify(response.data));
        if (!localStorage.getItem('savedSearches'))
          localStorage.setItem('savedSearches', JSON.stringify([]));
        setUser(response.data);
      })
      .catch(function (error) {
        setError(true);
      });
  };

  return (
    <Container sx={{ mt: 5 }} maxWidth={false}>
      <Paper sx={{ padding: 2 }} variant="outlined" square>
        <Box
          sx={{ width: '100%' }}
          mt={2}
          justifyContent="center"
          align-alignItems="center"
          textAlign="center"
        >
          <KeyIcon color="primary" sx={{ fontSize: 70 }} />
        </Box>
        <Box
          sx={{ width: '100%' }}
          mt={2}
          justifyContent="center"
          align-alignItems="center"
          textAlign="center"
        >
          <Typography variant="h5">Login using your SerpAPI Key</Typography>
          <Typography>
            You can find your SerpAPI Key{' '}
            <Button
              endIcon={<OpenInNewIcon />}
              variant="outlined"
              size="small"
              href="https://serpapi.com/manage-api-key"
              target="_blank"
            >
              HERE
            </Button>
          </Typography>
        </Box>
        <Box
          sx={{ width: '100%' }}
          mt={2}
          justifyContent="center"
          align-alignItems="center"
          textAlign="center"
        >
          <TextField
            sx={{ minWidth: '50%' }}
            value={apiKey}
            error={error}
            helperText={
              error && (
                <Typography>
                  Invalid API key. Your API key should be here:{' '}
                  <a href="https://serpapi.com/dashboard" target="_blank">
                    https://serpapi.com/manage-api-key
                  </a>
                </Typography>
              )
            }
            onChange={(e) => {
              setApiKey(e.target.value.trim());
              setError(false);
            }}
            label="SerpAPI Key"
            size="small"
            margin="dense"
          />
        </Box>

        <Box
          sx={{ width: '100%' }}
          mt={2}
          justifyContent="center"
          align-alignItems="center"
          textAlign="center"
        >
          <Button
            onClick={login}
            variant="outlined"
            sx={{ borderRadius: 0, pl: 5, pr: 5, py: 2 }}
          >
            LOGIN
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
