"use client";

import React, { useState, useEffect } from 'react';
import { useBids } from '../../src/state/BidsContext.jsx';
import WaterfallChart from '../../components/WaterfallChart.jsx';

export default function DashboardPage() {
  const { bids } = useBids();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="live-dashboard-container" />;
  }

  return (
    <div className="live-dashboard-container">
      <WaterfallChart bids={bids} />
    </div>
  );
}
