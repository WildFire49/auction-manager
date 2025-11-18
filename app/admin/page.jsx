"use client";

import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, IconButton, Tooltip, Divider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BidForm from '../../components/BidForm.jsx';
import BidList from '../../components/BidList.jsx';
import { useBids } from '../../src/state/BidsContext.jsx';

export default function AdminPage() {
  const { bids } = useBids();
  const [editingBid, setEditingBid] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
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
          <div className="panel-header">
            <Typography variant="h6" fontWeight={600}>
              Current Participants ({bids.length})
            </Typography>
          </div>
          <BidList onEdit={setEditingBid} />
        </Paper>
      </Grid>
    </Grid>
  );
}
