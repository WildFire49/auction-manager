"use client";

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';

export default function TopBar() {
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: 'blur(18px)',
        background: 'linear-gradient(to right, rgba(15,23,42,0.96), rgba(15,23,42,0.85))',
        borderBottom: '1px solid rgba(148, 163, 184, 0.35)',
      }}
   >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Auction Manager
        </Typography>
        <div>
          <Button
            component={Link}
            href="/"
            color="inherit"
            startIcon={<HomeIcon />}
            sx={{
              borderRadius: 999,
              px: 2.5,
              fontWeight: pathname === '/' ? 700 : 400,
            }}
          >
            Home
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
