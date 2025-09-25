-- Create assets table
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('desktop', 'laptop', 'server', 'other')),
  status TEXT NOT NULL CHECK (status IN ('active', 'maintenance', 'retired')),
  serial_number TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  warranty_expiry DATE,
  location TEXT NOT NULL,
  assigned_to TEXT,
  specifications JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (can be restricted later with authentication)
CREATE POLICY "Anyone can view assets" 
ON public.assets 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create assets" 
ON public.assets 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update assets" 
ON public.assets 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete assets" 
ON public.assets 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the assets table
ALTER TABLE public.assets REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;