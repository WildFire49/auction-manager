"use client";

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { motion, AnimatePresence } from 'framer-motion';
import { useBids } from '../src/state/BidsContext.jsx';

export default function BidList({ onEdit }) {
  const { bids, deleteBid } = useBids();

  return (
    <div className="bid-list-scroll">
      <AnimatePresence initial={false}>
        {bids.map((bid) => (
          <motion.div
            key={bid.id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="bid-row"
         >
            <div>
              <Typography className="bid-name">{bid.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Updated {new Date(bid.updatedAt || bid.createdAt).toLocaleTimeString()}
              </Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography className="bid-amount">₹ {Number(bid.amount || 0).toLocaleString('en-IN')}</Typography>
              {onEdit && (
                <Tooltip title="Edit bidder">
                  <IconButton size="small" onClick={() => onEdit(bid)} color="primary">
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Remove from list">
                <IconButton size="small" onClick={() => deleteBid(bid.id)} color="error">
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {bids.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No participants yet. Add your first bidder on the left.
        </Typography>
      )}
    </div>
  );
}
