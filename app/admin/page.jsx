"use client";

import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, IconButton, Tooltip, Divider, Button, Box, Chip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RefreshIcon from '@mui/icons-material/Refresh';
import BidForm from '../../components/BidForm.jsx';
import BidList from '../../components/BidList.jsx';
import SessionManager from '../../components/SessionManager.jsx';
import { useBids } from '../../src/state/BidsContext.jsx';

export default function AdminPage() {
  const { bids, resetBids, loading, refreshBids, activeSession } = useBids();
  const [editingBid, setEditingBid] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Poll every 5 seconds
  useEffect(() => {
    if (!mounted) return;
    
    const pollInterval = setInterval(() => {
      refreshBids();
      setLastRefresh(new Date());
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [mounted, refreshBids]);

  const downloadBids = () => {
    if (!activeSession) return;
    
    const csvContent = [
      ['Session Item', activeSession.item_name],
      ['Description', activeSession.item_description || 'N/A'],
      ['Starting Price', `₹ ${activeSession.starting_price || 0}`],
      ['Total Bidders', bids.length],
      ['Highest Bid', bids.length > 0 ? `₹ ${bids[0].amount}` : 'N/A'],
      [''],
      ['Rank', 'Name', 'Amount (₹)', 'Created At', 'Updated At'],
      ...bids.map((bid, index) => [
        index + 1,
        bid.name,
        bid.amount,
        new Date(bid.created_at).toLocaleString(),
        new Date(bid.updated_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `auction-${activeSession.item_name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to delete ALL bidders? This cannot be undone!')) {
      await resetBids();
      await refreshBids();
      setLastRefresh(new Date());
    }
  };

  const handleManualRefresh = async () => {
    await refreshBids();
    setLastRefresh(new Date());
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <SessionManager />
      
      {!activeSession ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 4,
          background: 'rgba(139, 92, 246, 0.05)',
          borderRadius: 3,
          border: '2px dashed rgba(139, 92, 246, 0.3)'
        }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            No Active Session
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create a new auction session to start accepting bids
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
        <Paper elevation={6} className="glass-panel">
          <div className="panel-header">
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {editingBid ? 'Edit Bidder' : 'Admin Control'}
            </Typography>
            <Tooltip title="Add or update bidders. Values are stored locally in your browser and reflected on the dashboard.">
              <IconButton size="small">
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {editingBid 
              ? 'Update the participant details below.'
              : 'Enter the participant name and committed amount in Indian Rupees. Updates instantly animate on the live dashboard.'
            }
          </Typography>
          <Divider sx={{ my: 2 }} />
          <BidForm editingBid={editingBid} onCancelEdit={() => setEditingBid(null)} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper elevation={6} className="glass-panel" style={{ height: '100%' }}>
          <div className="panel-header" style={{ marginBottom: '12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Current Participants ({bids.length})
              </Typography>
              <Chip 
                label={formatTimeAgo(lastRefresh)} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
            <IconButton 
              size="small" 
              onClick={handleManualRefresh}
              sx={{ 
                animation: loading ? 'rotate 1s linear infinite' : 'none',
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </div>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadBids}
              disabled={bids.length === 0}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #00c9a7, #06b6d4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00b894, #0891b2)',
                },
              }}
            >
              Download CSV
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={handleReset}
              disabled={bids.length === 0}
              sx={{ borderRadius: 2 }}
            >
              Clear All
            </Button>
          </Box>
          <BidList onEdit={setEditingBid} />
        </Paper>
      </Grid>
    </Grid>
      )}
    </>
  );
}
