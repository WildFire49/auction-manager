-- Create the bids table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on amount for faster sorting
CREATE INDEX IF NOT EXISTS bids_amount_idx ON public.bids(amount DESC);

-- Create an index on name for faster lookups
CREATE INDEX IF NOT EXISTS bids_name_idx ON public.bids(name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- (You can make this more restrictive based on your needs)
CREATE POLICY "Enable all access for bids" ON public.bids
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for the bids table
-- This allows real-time subscriptions to work
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before updates
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
