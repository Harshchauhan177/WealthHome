-- This is the complete and final script to fix database and storage permissions.
-- Please run this entire script in your Supabase SQL Editor.

-- Step 1: Ensure Row Level Security (RLS) is enabled for the 'properties' table.
-- If RLS is not enabled, the policies below will have no effect.
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Step 2: Remove all old, possibly incorrect, policies on the 'properties' table.
-- This ensures we start with a clean slate.
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.properties;
DROP POLICY IF EXISTS "Allow public read access" ON public.properties;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.properties;
DROP POLICY IF EXISTS "Allow public read access to properties" ON public.properties;
DROP POLICY IF EXISTS "Allow public insert access to properties" ON public.properties;

-- Step 3: Create the final, correct policies for the 'properties' table.
-- These policies allow ANYONE to read properties and ANYONE to add a new property.
CREATE POLICY "Allow public read access to properties" ON public.properties
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert access to properties" ON public.properties
FOR INSERT
WITH CHECK (true);

-- Step 4: Remove all old, possibly incorrect, policies from the storage bucket.
DROP POLICY IF EXISTS "Allow anonymous image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous image reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public image reads" ON storage.objects;

-- Step 5: Create the final, correct policies for the 'property-images' storage bucket.
-- These policies allow ANYONE to upload and view images in your 'property-images' bucket.
CREATE POLICY "Allow public image uploads" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow public image reads" ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images'); 