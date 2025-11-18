"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const BidsContext = createContext(null);
const STORAGE_KEY = 'auction-manager-bids-v1';

function readBidsFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load bids from storage', e);
    return [];
  }
}

export function BidsProvider({ children }) {
  // Initialize from localStorage on the very first render so dashboard sees data immediately
  const [bids, setBids] = useState(() => readBidsFromStorage());

  useEffect(() => {
    // keep in sync when another tab / window updates localStorage
    const handleStorage = (event) => {
      if (event.key !== STORAGE_KEY || event.storageArea !== window.localStorage) return;
      try {
        if (event.newValue) {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            setBids(parsed);
          }
        } else {
          setBids([]);
        }
      } catch (err) {
        console.error('Failed to sync bids from storage event', err);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bids));
    } catch (e) {
      console.error('Failed to save bids to storage', e);
    }
  }, [bids]);

  const api = useMemo(
    () => ({
      bids,
      upsertBid: ({ id, name, amount }) => {
        setBids((prev) => {
          const numericAmount = Number(amount) || 0;
          const trimmedName = (name || '').trim();
          if (!trimmedName) return prev;

          let next = [...prev];
          const existingIndex = id
            ? next.findIndex((b) => b.id === id)
            : next.findIndex((b) => b.name.toLowerCase() === trimmedName.toLowerCase());

          if (existingIndex >= 0) {
            next[existingIndex] = {
              ...next[existingIndex],
              name: trimmedName,
              amount: numericAmount,
              updatedAt: Date.now(),
            };
          } else {
            next.push({
              id: id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
              name: trimmedName,
              amount: numericAmount,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }

          next.sort((a, b) => b.amount - a.amount);
          return next;
        });
      },
      deleteBid: (id) => {
        setBids((prev) => prev.filter((b) => b.id !== id));
      },
      resetBids: () => setBids([]),
    }),
    [bids]
  );

  return <BidsContext.Provider value={api}>{children}</BidsContext.Provider>;
}

export function useBids() {
  const ctx = useContext(BidsContext);
  if (!ctx) throw new Error('useBids must be used within BidsProvider');
  return ctx;
}
