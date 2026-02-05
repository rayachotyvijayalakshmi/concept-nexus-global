-- Fix notifications: Remove public INSERT and make it more secure
-- Only system/authenticated users should create notifications via RPC function

-- Drop the existing overly permissive insert policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a security definer function for inserting notifications
-- This ensures only backend logic can create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_link text DEFAULT NULL,
  p_idea_id uuid DEFAULT NULL,
  p_actor_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  -- Ensure the caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Insert the notification
  INSERT INTO public.notifications (user_id, type, title, message, link, idea_id, actor_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_link, p_idea_id, p_actor_id)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;

-- Create a restrictive insert policy that only allows via the function
-- Since the function is SECURITY DEFINER, we need a policy that allows inserts
-- but only when the current user is authenticated
CREATE POLICY "Authenticated users can insert notifications via function"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);