-- Additional SQL to add sessions/items support
-- Run this AFTER the initial supabase-setup.sql

-- Create sessions (auction items) table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  item_description TEXT,
  starting_price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add session_id to bids table
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE;

-- Create index on session_id for faster lookups
CREATE INDEX IF NOT EXISTS bids_session_id_idx ON public.bids(session_id);

-- Enable RLS on sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for sessions
CREATE POLICY "Enable all access for sessions" ON public.sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;

-- Create trigger for sessions updated_at
CREATE TRIGGER set_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Update existing bids to have a default session (optional, for migration)
-- You can skip this if starting fresh
-- INSERT INTO public.sessions (item_name, item_description) 
-- VALUES ('Default Session', 'Initial auction session')
-- RETURNING id;
-- Then update bids: UPDATE public.bids SET session_id = '<session-id-from-above>';
