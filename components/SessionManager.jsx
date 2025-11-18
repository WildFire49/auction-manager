"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Typography,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useBids } from '../src/state/BidsContext.jsx';

export default function SessionManager() {
  const { sessions, activeSession, setActiveSession, createSession, updateSession } = useBids();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');

  const handleCloseAuction = async () => {
    if (!activeSession) return;
    await updateSession(activeSession.id, { status: 'completed' });
    setCloseDialogOpen(false);
  };

  const handleActivateSession = async (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      await updateSession(sessionId, { status: 'active' });
      setActiveSession(session);
    }
  };

  const handleCreateSession = async () => {
    if (!itemName.trim()) return;

    try {
      await createSession({
        item_name: itemName,
        item_description: itemDescription,
        starting_price: parseFloat(startingPrice) || 0,
        status: 'active'
      });
      
      setItemName('');
      setItemDescription('');
      setStartingPrice('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mr: 2 }}>
          Auction Control
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
            },
          }}
        >
          Add New Item
        </Button>

        {activeSession && activeSession.status === 'active' && (
          <Button
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            onClick={() => setCloseDialogOpen(true)}
            sx={{
              borderRadius: 2,
            }}
          >
            Close Auction
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Available Items
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {sessions.map((session) => (
            <Box
              key={session.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: session.id === activeSession?.id ? '2px solid #00c9a7' : '1px solid rgba(148, 163, 184, 0.3)',
                background: session.status === 'active' 
                  ? 'linear-gradient(135deg, rgba(0, 201, 167, 0.1), rgba(6, 182, 212, 0.1))'
                  : 'rgba(15, 23, 42, 0.5)',
                minWidth: 250,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                },
              }}
              onClick={() => {
                if (session.status !== 'active') {
                  handleActivateSession(session.id);
                } else {
                  setActiveSession(session);
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {session.item_name}
                </Typography>
                {session.status === 'active' ? (
                  <Chip 
                    icon={<PlayArrowIcon />}
                    label="LIVE" 
                    size="small" 
                    color="success"
                    sx={{ fontWeight: 700 }}
                  />
                ) : session.status === 'completed' ? (
                  <Chip 
                    icon={<CheckCircleIcon />}
                    label="Completed" 
                    size="small"
                    sx={{ background: 'rgba(148, 163, 184, 0.3)' }}
                  />
                ) : null}
              </Box>
              {session.starting_price > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Starting: ₹ {session.starting_price.toLocaleString('en-IN')}
                </Typography>
              )}
              {session.status !== 'active' && (
                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  Click to activate
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {activeSession && activeSession.status === 'active' && (
        <Box sx={{ 
          p: 3, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, rgba(0, 201, 167, 0.15), rgba(6, 182, 212, 0.15))',
          border: '2px solid rgba(0, 201, 167, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 201, 167, 0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PlayArrowIcon sx={{ color: '#00c9a7' }} />
            <Typography variant="overline" sx={{ color: '#00c9a7', fontWeight: 700, letterSpacing: 2 }}>
              NOW SHOWING ON DASHBOARD
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
            {activeSession.item_name}
          </Typography>
          {activeSession.item_description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {activeSession.item_description}
            </Typography>
          )}
          {activeSession.starting_price > 0 && (
            <Typography variant="h6" sx={{ color: '#00c9a7', fontWeight: 700 }}>
              Starting Price: ₹ {activeSession.starting_price.toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      )}
      
      {(!activeSession || activeSession.status !== 'active') && (
        <Box sx={{ 
          p: 3, 
          borderRadius: 3, 
          background: 'rgba(251, 191, 36, 0.1)',
          border: '2px dashed rgba(251, 191, 36, 0.4)',
          textAlign: 'center'
        }}>
          <Typography variant="h6" fontWeight={600} color="warning.main">
            ⚠️ No Active Item
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Dashboard is showing "Next Item Coming Soon". Click on an item above to activate it.
          </Typography>
        </Box>
      )}

      {/* Close Auction Confirmation Dialog */}
      <Dialog 
        open={closeDialogOpen} 
        onClose={() => setCloseDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: '#ef4444',
          fontWeight: 700
        }}>
          <StopIcon />
          Close Auction
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to close the auction for:
          </Typography>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            mb: 2
          }}>
            <Typography variant="h6" fontWeight={700}>
              {activeSession?.item_name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            This will mark the auction as completed and show "Next Item Coming Soon" on the dashboard.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setCloseDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCloseAuction} 
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            sx={{ borderRadius: 2 }}
          >
            Close Auction
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Auction Item</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Item Name"
              fullWidth
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Vintage Watch, Painting, etc."
            />
            <TextField
              label="Item Description"
              fullWidth
              multiline
              rows={3}
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Brief description of the item..."
            />
            <TextField
              label="Starting Price (Optional)"
              fullWidth
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupeeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder="0"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateSession} 
            variant="contained"
            disabled={!itemName.trim()}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              },
            }}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
