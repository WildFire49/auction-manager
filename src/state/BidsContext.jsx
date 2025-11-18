"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const BidsContext = createContext();

export function useBids() {
  return useContext(BidsContext);
}

export function BidsProvider({ children }) {
  const [bids, setBids] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch sessions and bids from Supabase on mount
  useEffect(() => {
    fetchSessions();
    
    // Subscribe to real-time changes for both tables
    const bidsChannel = supabase
      .channel('bids-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bids' },
        (payload) => {
          console.log('Real-time bids update:', payload);
          if (activeSession) {
            fetchBids(activeSession.id);
          }
        }
      )
      .subscribe();

    const sessionsChannel = supabase
      .channel('sessions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sessions' },
        (payload) => {
          console.log('Real-time sessions update:', payload);
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bidsChannel);
      supabase.removeChannel(sessionsChannel);
    };
  }, []);

  // Fetch bids when active session changes
  useEffect(() => {
    if (activeSession) {
      fetchBids(activeSession.id);
      
      // Poll every 2 seconds for latest data
      const pollInterval = setInterval(() => {
        fetchBids(activeSession.id);
      }, 2000);

      return () => clearInterval(pollInterval);
    } else {
      setBids([]);
    }
  }, [activeSession]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSessions(data || []);
      
      // Set first active session as default if none selected
      if (!activeSession && data && data.length > 0) {
        const firstActive = data.find(s => s.status === 'active') || data[0];
        setActiveSession(firstActive);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async (sessionId) => {
    if (!sessionId) return;
    
    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('session_id', sessionId)
        .order('amount', { ascending: false });
      
      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const createSession = async (sessionData) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()
        .single();
      
      if (error) throw error;
      await fetchSessions();
      setActiveSession(data);
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const updateSession = async (sessionId, updates) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', sessionId);
      
      if (error) throw error;
      await fetchSessions();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const upsertBid = async (bid) => {
    if (!activeSession) {
      console.error('No active session selected');
      return;
    }

    try {
      if (bid.id) {
        // Update existing bid
        const { error } = await supabase
          .from('bids')
          .update({ 
            name: bid.name, 
            amount: bid.amount,
            updated_at: new Date().toISOString()
          })
          .eq('id', bid.id);
        
        if (error) throw error;
      } else {
        // Check if name exists in this session
        const { data: existing, error: fetchError } = await supabase
          .from('bids')
          .select('id')
          .eq('session_id', activeSession.id)
          .ilike('name', bid.name)
          .maybeSingle();

        if (fetchError) {
          console.error('Error checking existing bid:', fetchError);
          throw fetchError;
        }

        if (existing) {
          // Update existing by name
          const { error } = await supabase
            .from('bids')
            .update({ 
              amount: bid.amount,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
          
          if (error) throw error;
        } else {
          // Insert new bid with session_id
          const { error } = await supabase
            .from('bids')
            .insert([{ 
              name: bid.name, 
              amount: bid.amount,
              session_id: activeSession.id
            }]);
          
          if (error) throw error;
        }
      }
    } catch (error) {
      console.error('Error upserting bid:', error);
    }
  };

  const deleteBid = async (id) => {
    try {
      const { error } = await supabase
        .from('bids')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting bid:', error);
    }
  };

  const resetBids = async () => {
    if (!activeSession) return;
    
    try {
      const { error } = await supabase
        .from('bids')
        .delete()
        .eq('session_id', activeSession.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting bids:', error);
    }
  };

  const refreshBids = async () => {
    if (activeSession) {
      await fetchBids(activeSession.id);
    }
  };

  return (
    <BidsContext.Provider value={{ 
      bids, 
      sessions,
      activeSession,
      setActiveSession,
      createSession,
      updateSession,
      upsertBid, 
      deleteBid, 
      resetBids, 
      loading, 
      refreshBids 
    }}>
      {children}
    </BidsContext.Provider>
  );
}
