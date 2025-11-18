"use client";

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import { useBids } from '../src/state/BidsContext.jsx';

export default function BidForm({ editingBid, onCancelEdit }) {
  const { upsertBid, refreshBids } = useBids();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (editingBid) {
      setName(editingBid.name);
      setAmount(editingBid.amount.toString());
    } else {
      setName('');
      setAmount('');
    }
  }, [editingBid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await upsertBid({ 
      id: editingBid?.id,
      name, 
      amount: parseFloat(amount || '0') 
    });
    // Immediately refresh the list
    await refreshBids();
    setAmount('');
    setName('');
    if (onCancelEdit) onCancelEdit();
  };

  const handleCancel = () => {
    setName('');
    setAmount('');
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Participant name"
        fullWidth
        required
        size="medium"
        value={name}
        onChange={(e) => setName(e.target.value)}
        helperText="This will be shown on the big screen"
      />
      <TextField
        label="Amount"
        fullWidth
        required
        size="medium"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CurrencyRupeeRoundedIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        helperText="Commitment in Indian Rupees"
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {editingBid && (
          <Button 
            variant="outlined" 
            size="large" 
            onClick={handleCancel}
            sx={{ borderRadius: 999, px: 3 }}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 999, px: 4 }}>
          {editingBid ? 'Update Bid' : 'Add Bid'}
        </Button>
      </Box>
    </Box>
  );
}
