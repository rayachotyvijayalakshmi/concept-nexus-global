-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('idea_owner', 'developer', 'designer', 'mentor', 'investor');

-- Create enum for idea visibility
CREATE TYPE public.idea_visibility AS ENUM ('public', 'preview');

-- Create enum for idea category
CREATE TYPE public.idea_category AS ENUM ('business', 'app', 'startup', 'tech', 'social');

-- Create enum for collaboration status
CREATE TYPE public.collaboration_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for investment stage preference
CREATE TYPE public.investment_stage AS ENUM ('pre_seed', 'seed', 'series_a', 'series_b', 'growth');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'idea_owner',
  headline TEXT,
  about TEXT,
  avatar_url TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  linkedin_url TEXT,
  github_url TEXT,
  behance_url TEXT,
  portfolio_url TEXT,
  -- Developer/Designer specific
  experience_years INTEGER,
  -- Mentor specific
  guidance_domains TEXT[] DEFAULT '{}',
  -- Investor specific
  investment_interests TEXT[] DEFAULT '{}',
  investment_stage investment_stage,
  ticket_size_min INTEGER,
  ticket_size_max INTEGER,
  open_to_pitches BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ideas table
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  high_level_concept TEXT NOT NULL,
  detailed_solution TEXT,
  target_audience TEXT,
  visibility idea_visibility NOT NULL DEFAULT 'preview',
  category idea_category NOT NULL DEFAULT 'startup',
  looking_for user_role[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create idea_upvotes table (to track who upvoted what)
CREATE TABLE public.idea_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, user_id)
);

-- Create collaboration_requests table
CREATE TABLE public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status collaboration_status NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, requester_id)
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  participant_two UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
  is_approved BOOLEAN DEFAULT false,
  intro_messages_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(participant_one, participant_two, idea_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blocked_users table
CREATE TABLE public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Create function to get current user's profile id
CREATE OR REPLACE FUNCTION public.get_current_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Ideas policies
CREATE POLICY "Anyone can view ideas" ON public.ideas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Owners can insert ideas" ON public.ideas
  FOR INSERT TO authenticated WITH CHECK (owner_id = public.get_current_profile_id());

CREATE POLICY "Owners can update own ideas" ON public.ideas
  FOR UPDATE TO authenticated USING (owner_id = public.get_current_profile_id());

CREATE POLICY "Owners can delete own ideas" ON public.ideas
  FOR DELETE TO authenticated USING (owner_id = public.get_current_profile_id());

-- Idea upvotes policies
CREATE POLICY "Users can view upvotes" ON public.idea_upvotes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can upvote" ON public.idea_upvotes
  FOR INSERT TO authenticated WITH CHECK (user_id = public.get_current_profile_id());

CREATE POLICY "Users can remove own upvote" ON public.idea_upvotes
  FOR DELETE TO authenticated USING (user_id = public.get_current_profile_id());

-- Collaboration requests policies
CREATE POLICY "Users can view own requests" ON public.collaboration_requests
  FOR SELECT TO authenticated USING (
    requester_id = public.get_current_profile_id() OR 
    owner_id = public.get_current_profile_id()
  );

CREATE POLICY "Users can create requests" ON public.collaboration_requests
  FOR INSERT TO authenticated WITH CHECK (requester_id = public.get_current_profile_id());

CREATE POLICY "Owners can update request status" ON public.collaboration_requests
  FOR UPDATE TO authenticated USING (owner_id = public.get_current_profile_id());

-- Conversations policies
CREATE POLICY "Participants can view conversations" ON public.conversations
  FOR SELECT TO authenticated USING (
    participant_one = public.get_current_profile_id() OR 
    participant_two = public.get_current_profile_id()
  );

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT TO authenticated WITH CHECK (
    participant_one = public.get_current_profile_id() OR 
    participant_two = public.get_current_profile_id()
  );

CREATE POLICY "Participants can update conversations" ON public.conversations
  FOR UPDATE TO authenticated USING (
    participant_one = public.get_current_profile_id() OR 
    participant_two = public.get_current_profile_id()
  );

-- Messages policies
CREATE POLICY "Conversation participants can view messages" ON public.messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_one = public.get_current_profile_id() OR c.participant_two = public.get_current_profile_id())
    )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (
    sender_id = public.get_current_profile_id() AND
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_one = public.get_current_profile_id() OR c.participant_two = public.get_current_profile_id())
    )
  );

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_one = public.get_current_profile_id() OR c.participant_two = public.get_current_profile_id())
    )
  );

-- Reports policies
CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT TO authenticated WITH CHECK (reporter_id = public.get_current_profile_id());

CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT TO authenticated USING (reporter_id = public.get_current_profile_id());

-- Blocked users policies
CREATE POLICY "Users can view own blocks" ON public.blocked_users
  FOR SELECT TO authenticated USING (blocker_id = public.get_current_profile_id());

CREATE POLICY "Users can block others" ON public.blocked_users
  FOR INSERT TO authenticated WITH CHECK (blocker_id = public.get_current_profile_id());

CREATE POLICY "Users can unblock" ON public.blocked_users
  FOR DELETE TO authenticated USING (blocker_id = public.get_current_profile_id());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaboration_requests_updated_at
  BEFORE UPDATE ON public.collaboration_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update idea upvote count
CREATE OR REPLACE FUNCTION public.update_idea_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.ideas SET upvotes = upvotes + 1 WHERE id = NEW.idea_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.ideas SET upvotes = upvotes - 1 WHERE id = OLD.idea_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_upvotes_on_vote
  AFTER INSERT OR DELETE ON public.idea_upvotes
  FOR EACH ROW EXECUTE FUNCTION public.update_idea_upvotes();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Create storage bucket for avatars and files
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('idea-files', 'idea-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('message-files', 'message-files', false);

-- Storage policies for avatars (public bucket)
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- Storage policies for idea files
CREATE POLICY "Authenticated users can view idea files" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'idea-files');

CREATE POLICY "Authenticated users can upload idea files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'idea-files');

-- Storage policies for message files
CREATE POLICY "Authenticated users can view message files" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'message-files');

CREATE POLICY "Authenticated users can upload message files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'message-files');