-- Add remote_id column to assets table
ALTER TABLE public.assets 
ADD COLUMN remote_id TEXT;