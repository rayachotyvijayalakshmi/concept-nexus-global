-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new SELECT policy that only allows authenticated users
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Create a secure view that hides email for non-owners
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  full_name,
  role,
  headline,
  about,
  avatar_url,
  location,
  skills,
  linkedin_url,
  github_url,
  behance_url,
  portfolio_url,
  experience_years,
  guidance_domains,
  investment_interests,
  investment_stage,
  ticket_size_min,
  ticket_size_max,
  open_to_pitches,
  created_at,
  updated_at,
  -- Only show email to the profile owner
  CASE WHEN user_id = auth.uid() THEN email ELSE NULL END as email
FROM public.profiles;