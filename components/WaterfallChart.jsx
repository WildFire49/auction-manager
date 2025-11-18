"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

export default function WaterfallChart({ bids }) {
  const [mounted, setMounted] = useState(false);
  const [newBidIds, setNewBidIds] = useState(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const { series, maxAmount } = useMemo(() => {
    if (!bids || bids.length === 0) {
      return { series: [], maxAmount: 0 };
    }
    const cleaned = bids.map((b) => ({ ...b, amount: Number(b.amount) || 0 }));
    const max = cleaned.reduce((m, b) => Math.max(m, b.amount), 0);
    return {
      series: cleaned,
      maxAmount: max || 1,
    };
  }, [bids]);

  useEffect(() => {
    const currentIds = new Set(series.map(b => b.id));
    const previousIds = new Set(newBidIds);
    
    currentIds.forEach(id => {
      if (!previousIds.has(id)) {
        setNewBidIds(prev => new Set([...prev, id]));
        setTimeout(() => {
          setNewBidIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 2000);
      }
    });
  }, [series]);

  const colorBands = [
    'linear-gradient(135deg, #00d9b3 0%, #00b894 50%, #00a885 100%)',
    'linear-gradient(135deg, #00d4ff 0%, #0099ff 50%, #0066ff 100%)',
    'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
    'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
    'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 50%, #0d9488 100%)',
    'linear-gradient(135deg, #a3e635 0%, #84cc16 50%, #65a30d 100%)',
    'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
  ];

  if (!mounted) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#64748b',
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          Loading...
        </Typography>
      </div>
    );
  }

  if (!series.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', padding: '120px 20px' }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#64748b',
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          Waiting for bidders...
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="waterfall-grid">
      <AnimatePresence mode="popLayout">
        {series.map((bid, index) => {
          const widthPct = (bid.amount / maxAmount) * 100;
          const isNew = newBidIds.has(bid.id);
          const rank = index + 1;

          return (
            <motion.div
              key={bid.id}
              layout="position"
              className="waterfall-row"
              initial={{ opacity: 0, y: 150, scale: 0.85 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.85, 
                x: -120,
                transition: { duration: 0.3 }
              }}
              transition={{
                layout: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 30,
                  mass: 0.9,
                },
                opacity: { duration: 0.4 },
                y: {
                  type: 'spring',
                  stiffness: 160,
                  damping: 24,
                  mass: 1,
                },
                scale: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 25,
                },
              }}
            >
              <motion.div
                layout="position"
                className="waterfall-bar-shell"
                initial={false}
                animate={{
                  boxShadow: isNew 
                    ? '0 0 40px rgba(59, 130, 246, 0.6), 0 4px 20px rgba(0, 0, 0, 0.3)'
                    : '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
                transition={{ 
                  layout: { type: 'spring', stiffness: 200, damping: 30 },
                  boxShadow: { duration: 0.5 }
                }}
              >
                <motion.div
                  layout="position"
                  className={`waterfall-bar-fill ${isNew ? 'shimmer' : ''}`}
                  style={{ background: colorBands[index % colorBands.length] }}
                  initial={{ width: '8%' }}
                  animate={{ 
                    width: `${Math.max(15, widthPct)}%`,
                  }}
                  transition={{
                    layout: { type: 'spring', stiffness: 200, damping: 30 },
                    width: {
                      type: 'spring',
                      stiffness: 120,
                      damping: 20,
                      mass: 1.2,
                    },
                  }}
                >
                  <motion.div 
                    className="waterfall-bar-amount-label"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    ₹ {bid.amount.toLocaleString('en-IN')}
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                layout="position"
                className="waterfall-row-meta"
                initial={{ opacity: 0, x: 30 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: isNew ? [1, 1.08, 1] : 1,
                }}
                transition={{ 
                  layout: { type: 'spring', stiffness: 200, damping: 30 },
                  opacity: { delay: 0.2, duration: 0.4 },
                  x: { delay: 0.2, type: 'spring', stiffness: 180, damping: 22 },
                  scale: { duration: 0.6 }
                }}
              >
                <div className="waterfall-row-meta-primary">
                  {rank === 1 && <EmojiEventsIcon sx={{ fontSize: '1.3rem', color: '#fbbf24', mr: 0.5, verticalAlign: 'middle' }} />}
                  {rank === 2 && <WorkspacePremiumIcon sx={{ fontSize: '1.2rem', color: '#94a3b8', mr: 0.5, verticalAlign: 'middle' }} />}
                  {rank === 3 && <MilitaryTechIcon sx={{ fontSize: '1.2rem', color: '#d97706', mr: 0.5, verticalAlign: 'middle' }} />}
                  {bid.name.charAt(0).toUpperCase() + bid.name.slice(1)}
                </div>
                <div className="waterfall-row-meta-secondary">
                  Rank #{rank}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
