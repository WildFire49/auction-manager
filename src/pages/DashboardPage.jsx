import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useBids } from '../state/BidsContext.jsx';
import WaterfallChart from '../ui/WaterfallChart.jsx';

export default function DashboardPage() {
  const { bids } = useBids();
  const total = bids.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const maxBid = bids[0]?.amount || 0;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Live Auction Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          All values in INR (₹). Bars flow and re-arrange live as you update bids in the admin panel.
        </Typography>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper elevation={8} className="glass-panel waterfall-panel">
          <WaterfallChart bids={bids} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={8} className="glass-panel stats-panel">
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Snapshot
          </Typography>
          <Box className="stat-row">
            <span className="stat-label">Total Commitment</span>
            <span className="stat-value">₹ {total.toLocaleString('en-IN')}</span>
          </Box>
          <Box className="stat-row">
            <span className="stat-label">Highest Single Bid</span>
            <span className="stat-value">₹ {maxBid.toLocaleString('en-IN')}</span>
          </Box>
          <Box className="stat-row">
            <span className="stat-label">Participants</span>
            <span className="stat-value">{bids.length}</span>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Tip: Keep this dashboard on a large display. As bids grow, the waterfall will dynamically reflow and animate
            to keep the excitement visible.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
