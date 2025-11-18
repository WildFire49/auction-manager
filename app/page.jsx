"use client";

import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function LandingPage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>
          Auction Manager
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Choose your destination
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 400 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => router.push('/admin')}
            sx={{
              py: 2.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 16px 50px rgba(99, 102, 241, 0.5)',
              },
            }}
          >
            Admin Panel
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<DashboardIcon />}
            onClick={() => router.push('/dashboard')}
            sx={{
              py: 2.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #00c9a7, #06b6d4)',
              boxShadow: '0 12px 40px rgba(0, 201, 167, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00b894, #0891b2)',
                boxShadow: '0 16px 50px rgba(0, 201, 167, 0.5)',
              },
            }}
          >
            Live Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
