-- Add IP address field to assets table
ALTER TABLE public.assets 
ADD COLUMN ip_address inet;