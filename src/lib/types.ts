export type UserRole = 'idea_owner' | 'developer' | 'designer' | 'mentor' | 'investor';

export type IdeaVisibility = 'public' | 'preview';

export type IdeaCategory = 'business' | 'app' | 'startup' | 'tech' | 'social';

export type CollaborationStatus = 'pending' | 'approved' | 'rejected';

export type InvestmentStage = 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'growth';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  headline?: string;
  about?: string;
  avatar_url?: string;
  location?: string;
  skills: string[];
  linkedin_url?: string;
  github_url?: string;
  behance_url?: string;
  portfolio_url?: string;
  experience_years?: number;
  guidance_domains: string[];
  investment_interests: string[];
  investment_stage?: InvestmentStage;
  ticket_size_min?: number;
  ticket_size_max?: number;
  open_to_pitches: boolean;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  owner_id: string;
  title: string;
  problem_statement: string;
  high_level_concept: string;
  detailed_solution?: string;
  target_audience?: string;
  visibility: IdeaVisibility;
  category: IdeaCategory;
  looking_for: UserRole[];
  upvotes: number;
  created_at: string;
  updated_at: string;
  owner?: Profile;
}

export interface CollaborationRequest {
  id: string;
  idea_id: string;
  requester_id: string;
  owner_id: string;
  status: CollaborationStatus;
  message?: string;
  created_at: string;
  updated_at: string;
  requester?: Profile;
  idea?: Idea;
}

export interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  idea_id?: string;
  is_approved: boolean;
  intro_messages_count: number;
  created_at: string;
  updated_at: string;
  other_participant?: Profile;
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  file_url?: string;
  file_name?: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export const roleLabels: Record<UserRole, string> = {
  idea_owner: 'Idea Owner',
  developer: 'Developer',
  designer: 'Designer',
  mentor: 'Mentor',
  investor: 'Investor',
};

export const roleColors: Record<UserRole, string> = {
  idea_owner: 'role-idea-owner',
  developer: 'role-developer',
  designer: 'role-designer',
  mentor: 'role-mentor',
  investor: 'role-investor',
};

export const categoryLabels: Record<IdeaCategory, string> = {
  business: 'Business',
  app: 'App',
  startup: 'Startup',
  tech: 'Tech',
  social: 'Social',
};

export const investmentStageLabels: Record<InvestmentStage, string> = {
  pre_seed: 'Pre-Seed',
  seed: 'Seed',
  series_a: 'Series A',
  series_b: 'Series B',
  growth: 'Growth',
};
