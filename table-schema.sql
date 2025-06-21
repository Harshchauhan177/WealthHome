
-- Create the properties table
CREATE TABLE properties (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT,
  description TEXT,
  location TEXT,
  price NUMERIC,
  type TEXT, -- 'buy' or 'rent'
  beds INT,
  baths INT,
  sqft INT,
  image_url TEXT
);

-- Set up Row Level Security (RLS)
-- 1. Enable RLS on the table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows public read access
CREATE POLICY 'Allow public read access' ON properties
FOR SELECT
USING (true);

-- 3. Create a policy that allows authenticated users to insert
CREATE POLICY 'Allow authenticated insert' ON properties
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create the storage bucket for property images
-- This needs to be done in the Supabase UI, but here's a note.
-- Bucket name: property-images
-- Permissions: Public access for reads (or use signed URLs for more security)

-- It is recommended to create a policy for authenticated users to upload to the bucket.
-- Go to Storage -> Policies and create a new policy for the 'property-images' bucket.
-- Allow INSERT for authenticated users.

