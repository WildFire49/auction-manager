"use client";

import React from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Container from '@mui/material/Container';
import { usePathname } from 'next/navigation';
import { BidsProvider } from '../src/state/BidsContext.jsx';
import TopBar from '../components/TopBar.jsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00c9a7' },
    secondary: { main: '#0066ff' },
    background: {
      default: '#020617',
      paper: 'rgba(15, 23, 42, 0.92)',
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});

export default function ClientProviders({ children }) {
  const pathname = usePathname();
  const showTopBar = pathname !== '/dashboard';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BidsProvider>
        {showTopBar && <TopBar />}
        <Container maxWidth="lg" sx={{ py: showTopBar ? 4 : 0 }}>
          {children}
        </Container>
      </BidsProvider>
    </ThemeProvider>
  );
}
