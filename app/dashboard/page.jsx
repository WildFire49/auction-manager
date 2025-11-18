"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useBids } from '../../src/state/BidsContext.jsx';
import WaterfallChart from '../../components/WaterfallChart.jsx';
import ReactCanvasConfetti from 'react-canvas-confetti';

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 9999,
};

export default function DashboardPage() {
  const { bids, activeSession } = useBids();
  const [mounted, setMounted] = useState(false);
  const [prevBidCount, setPrevBidCount] = useState(0);
  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger confetti when new bidder is added
  useEffect(() => {
    if (mounted && bids.length > prevBidCount && prevBidCount > 0) {
      fire();
    }
    setPrevBidCount(bids.length);
  }, [bids.length, mounted, prevBidCount, fire]);

  if (!mounted) {
    return <div className="live-dashboard-container" />;
  }

  return (
    <>
      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
      
      {/* Spotlights */}
      <div className="spotlight spotlight-1"></div>
      <div className="spotlight spotlight-2"></div>
      <div className="spotlight spotlight-3"></div>
      
      {/* Floating auction elements */}
      <div className="auction-float-container">
        <div className="auction-float-item">
          <div className="bid-card-float">₹ 50,000</div>
        </div>
        <div className="auction-float-item">
          <div className="currency-float">₹</div>
        </div>
        <div className="auction-float-item">
          <div className="gavel-float">🔨</div>
        </div>
        <div className="auction-float-item">
          <div className="bid-card-float">HIGHEST BID</div>
        </div>
        <div className="auction-float-item">
          <div className="currency-float">💰</div>
        </div>
        <div className="auction-float-item">
          <div className="bid-card-float">₹ 1,00,000</div>
        </div>
        <div className="auction-float-item">
          <div className="gavel-float">⚡</div>
        </div>
        <div className="auction-float-item">
          <div className="bid-card-float">LIVE AUCTION</div>
        </div>
        <div className="auction-float-item">
          <div className="currency-float">₹</div>
        </div>
        <div className="auction-float-item">
          <div className="bid-card-float">₹ 75,000</div>
        </div>
      </div>
      
      <div className="live-dashboard-container">
        {!activeSession || activeSession.status === 'completed' ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 12,
            px: 4,
          }}>
            <Typography 
              variant="h2" 
              fontWeight={900} 
              sx={{ 
                mb: 3,
                background: 'linear-gradient(135deg, #00c9a7, #06b6d4, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Next Item Coming Soon
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Please wait while we prepare the next auction item
            </Typography>
            <Box sx={{ 
              display: 'inline-flex',
              gap: 2,
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                background: '#00c9a7',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                background: '#06b6d4',
                animation: 'pulse 1.5s ease-in-out infinite 0.2s'
              }} />
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                background: '#8b5cf6',
                animation: 'pulse 1.5s ease-in-out infinite 0.4s'
              }} />
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ 
              textAlign: 'center', 
              mb: 5,
              p: 4,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(0, 201, 167, 0.2))',
              borderRadius: 4,
              backdropFilter: 'blur(12px)',
              border: '2px solid rgba(139, 92, 246, 0.4)',
              boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)'
            }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: '#ffffff', 
                  fontWeight: 700, 
                  letterSpacing: 3,
                  fontSize: '0.9rem'
                }}
              >
                LIVE AUCTION
              </Typography>
              <Typography 
                variant="h2" 
                fontWeight={900} 
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  color: '#ffffff',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  letterSpacing: 1
                }}
              >
                {activeSession.item_name}
              </Typography>
              {activeSession.item_description && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3,
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  {activeSession.item_description}
                </Typography>
              )}
              {activeSession.starting_price > 0 && (
                <Box sx={{ 
                  display: 'inline-block',
                  mt: 2,
                  px: 4,
                  py: 2,
                  background: 'linear-gradient(135deg, #00c9a7, #06b6d4)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 201, 167, 0.4)'
                }}>
                  <Typography 
                    variant="h4" 
                    fontWeight={800}
                    sx={{ 
                      color: '#ffffff',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    Starting Price: ₹ {activeSession.starting_price.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              )}
            </Box>
            <WaterfallChart bids={bids} />
          </>
        )}
      </div>
    </>
  );
}
