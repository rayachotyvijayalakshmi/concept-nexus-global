export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_requests: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          message: string | null
          owner_id: string
          requester_id: string
          status: Database["public"]["Enums"]["collaboration_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          message?: string | null
          owner_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["collaboration_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          message?: string | null
          owner_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["collaboration_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_requests_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          idea_id: string | null
          intro_messages_count: number | null
          is_approved: boolean | null
          participant_one: string
          participant_two: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id?: string | null
          intro_messages_count?: number | null
          is_approved?: boolean | null
          participant_one: string
          participant_two: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string | null
          intro_messages_count?: number | null
          is_approved?: boolean | null
          participant_one?: string
          participant_two?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_one_fkey"
            columns: ["participant_one"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_one_fkey"
            columns: ["participant_one"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_two_fkey"
            columns: ["participant_two"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_two_fkey"
            columns: ["participant_two"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_upvotes: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_upvotes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          category: Database["public"]["Enums"]["idea_category"]
          created_at: string
          detailed_solution: string | null
          high_level_concept: string
          id: string
          looking_for: Database["public"]["Enums"]["user_role"][] | null
          owner_id: string
          problem_statement: string
          target_audience: string | null
          title: string
          updated_at: string
          upvotes: number | null
          visibility: Database["public"]["Enums"]["idea_visibility"]
        }
        Insert: {
          category?: Database["public"]["Enums"]["idea_category"]
          created_at?: string
          detailed_solution?: string | null
          high_level_concept: string
          id?: string
          looking_for?: Database["public"]["Enums"]["user_role"][] | null
          owner_id: string
          problem_statement: string
          target_audience?: string | null
          title: string
          updated_at?: string
          upvotes?: number | null
          visibility?: Database["public"]["Enums"]["idea_visibility"]
        }
        Update: {
          category?: Database["public"]["Enums"]["idea_category"]
          created_at?: string
          detailed_solution?: string | null
          high_level_concept?: string
          id?: string
          looking_for?: Database["public"]["Enums"]["user_role"][] | null
          owner_id?: string
          problem_statement?: string
          target_audience?: string | null
          title?: string
          updated_at?: string
          upvotes?: number | null
          visibility?: Database["public"]["Enums"]["idea_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "ideas_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          avatar_url: string | null
          behance_url: string | null
          created_at: string
          email: string
          experience_years: number | null
          full_name: string
          github_url: string | null
          guidance_domains: string[] | null
          headline: string | null
          id: string
          investment_interests: string[] | null
          investment_stage:
            | Database["public"]["Enums"]["investment_stage"]
            | null
          linkedin_url: string | null
          location: string | null
          open_to_pitches: boolean | null
          portfolio_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          skills: string[] | null
          ticket_size_max: number | null
          ticket_size_min: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          behance_url?: string | null
          created_at?: string
          email: string
          experience_years?: number | null
          full_name: string
          github_url?: string | null
          guidance_domains?: string[] | null
          headline?: string | null
          id?: string
          investment_interests?: string[] | null
          investment_stage?:
            | Database["public"]["Enums"]["investment_stage"]
            | null
          linkedin_url?: string | null
          location?: string | null
          open_to_pitches?: boolean | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          ticket_size_max?: number | null
          ticket_size_min?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          behance_url?: string | null
          created_at?: string
          email?: string
          experience_years?: number | null
          full_name?: string
          github_url?: string | null
          guidance_domains?: string[] | null
          headline?: string | null
          id?: string
          investment_interests?: string[] | null
          investment_stage?:
            | Database["public"]["Enums"]["investment_stage"]
            | null
          linkedin_url?: string | null
          location?: string | null
          open_to_pitches?: boolean | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          ticket_size_max?: number | null
          ticket_size_min?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reason: string
          reported_idea_id: string | null
          reported_user_id: string | null
          reporter_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reported_idea_id?: string | null
          reported_user_id?: string | null
          reporter_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reported_idea_id?: string | null
          reported_user_id?: string | null
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_idea_id_fkey"
            columns: ["reported_idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles_public: {
        Row: {
          about: string | null
          avatar_url: string | null
          behance_url: string | null
          created_at: string | null
          email: string | null
          experience_years: number | null
          full_name: string | null
          github_url: string | null
          guidance_domains: string[] | null
          headline: string | null
          id: string | null
          investment_interests: string[] | null
          investment_stage:
            | Database["public"]["Enums"]["investment_stage"]
            | null
          linkedin_url: string | null
          location: string | null
          open_to_pitches: boolean | null
          portfolio_url: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          skills: string[] | null
          ticket_size_max: number | null
          ticket_size_min: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          behance_url?: string | null
          created_at?: string | null
          email?: never
          experience_years?: number | null
          full_name?: string | null
          github_url?: string | null
          guidance_domains?: string[] | null
          headline?: string | null
          id?: string | null
          investment_interests?: string[] | null
          investment_stage?:
            | Database["public"]["Enums"]["investment_stage"]
            | null
          linkedin_url?: string | null
          location?: string | null
          open_to_pitches?: boolean | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          skills?: string[] | null
          ticket_size_max?: number | null
          ticket_size_min?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          behance_url?: string | null
          created_at?: string | null
          email?: never
          experience_years?: number | null
          full_name?: string | null
          github_url?: string | null
          guidance_domains?: string[] | null
          headline?: string | null
          id?: string | null
          investment_interests?: string[] | null
          investment_stage?:
            | Database["public"]["Enums"]["investment_stage"]
            | null
          linkedin_url?: string | null
          location?: string | null
          open_to_pitches?: boolean | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          skills?: string[] | null
          ticket_size_max?: number | null
          ticket_size_min?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_current_profile_id: { Args: never; Returns: string }
    }
    Enums: {
      collaboration_status: "pending" | "approved" | "rejected"
      idea_category: "business" | "app" | "startup" | "tech" | "social"
      idea_visibility: "public" | "preview"
      investment_stage: "pre_seed" | "seed" | "series_a" | "series_b" | "growth"
      user_role: "idea_owner" | "developer" | "designer" | "mentor" | "investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      collaboration_status: ["pending", "approved", "rejected"],
      idea_category: ["business", "app", "startup", "tech", "social"],
      idea_visibility: ["public", "preview"],
      investment_stage: ["pre_seed", "seed", "series_a", "series_b", "growth"],
      user_role: ["idea_owner", "developer", "designer", "mentor", "investor"],
    },
  },
} as const
