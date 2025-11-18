import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import AdminPage from './pages/AdminPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function Navigation() {
  const location = useLocation();

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(16px)', background: 'rgba(5, 10, 25, 0.85)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Auction Manager
        </Typography>
        <div>
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{
              mr: 1,
              borderRadius: 999,
              px: 2.5,
              fontWeight: location.pathname === '/' ? 700 : 400,
            }}
          >
            Admin
          </Button>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            sx={{
              borderRadius: 999,
              px: 3,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #00c9a7, #0066ff)',
              boxShadow: '0 12px 30px rgba(0, 102, 255, 0.35)',
            }}
          >
            Live Dashboard
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <div className="app-root">
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<AdminPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Container>
    </div>
  );
}
