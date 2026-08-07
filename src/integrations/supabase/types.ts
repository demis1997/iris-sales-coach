/**
 * Phase 1 database types for Artemis AI multi-tenant foundation.
 * Regenerate from Supabase when migrations are applied in production.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole =
  | "platform_admin"
  | "owner"
  | "admin"
  | "ceo"
  | "manager"
  | "qa"
  | "team_leader"
  | "rep"
  | "viewer"
  | "trainer";

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          plan: string;
          seats: number;
          industry: string | null;
          country: string | null;
          timezone: string | null;
          company_size: string | null;
          primary_use_case: string | null;
          expected_agent_count: number | null;
          primary_language: string | null;
          additional_languages: string[] | null;
          logo_url: string | null;
          currency: string | null;
          status: string;
          onboarding_completed_at: string | null;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string | null;
          plan?: string;
          seats?: number;
          industry?: string | null;
          country?: string | null;
          timezone?: string | null;
          company_size?: string | null;
          primary_use_case?: string | null;
          expected_agent_count?: number | null;
          primary_language?: string | null;
          additional_languages?: string[] | null;
          logo_url?: string | null;
          currency?: string | null;
          status?: string;
          onboarding_completed_at?: string | null;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          company_id: string | null;
          active_company_id: string | null;
          full_name: string | null;
          job_title: string | null;
          avatar_url: string | null;
          email: string | null;
          phone: string | null;
          locale: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          company_id?: string | null;
          active_company_id?: string | null;
          full_name?: string | null;
          job_title?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          phone?: string | null;
          locale?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          company_id: string | null;
          role: AppRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_id?: string | null;
          role: AppRole;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Insert"]>;
        Relationships: [];
      };
      company_memberships: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          role: AppRole;
          status: string;
          invited_by: string | null;
          joined_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id: string;
          role?: AppRole;
          status?: string;
          invited_by?: string | null;
          joined_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_memberships"]["Insert"]>;
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          manager_user_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          manager_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["teams"]["Insert"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          company_id: string;
          team_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          team_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      company_settings: {
        Row: {
          company_id: string;
          working_hours: Json | null;
          recording_consent_required: boolean;
          recording_announcement: string | null;
          currency: string | null;
          allow_agent_leaderboard: boolean;
          allow_executive_call_access: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          working_hours?: Json | null;
          recording_consent_required?: boolean;
          recording_announcement?: string | null;
          currency?: string | null;
          allow_agent_leaderboard?: boolean;
          allow_executive_call_access?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_settings"]["Insert"]>;
        Relationships: [];
      };
      company_ai_settings: {
        Row: {
          company_id: string;
          coaching_tone: string | null;
          scoring_strictness: string | null;
          compliance_sensitivity: string | null;
          default_language: string | null;
          auto_create_coaching_tasks: boolean;
          live_coaching_enabled: boolean;
          allowed_models: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          coaching_tone?: string | null;
          scoring_strictness?: string | null;
          compliance_sensitivity?: string | null;
          default_language?: string | null;
          auto_create_coaching_tasks?: boolean;
          live_coaching_enabled?: boolean;
          allowed_models?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_ai_settings"]["Insert"]>;
        Relationships: [];
      };
      company_retention_policies: {
        Row: {
          company_id: string;
          recording_retention_days: number | null;
          transcript_retention_days: number | null;
          analysis_retention_days: number | null;
          soft_delete_grace_days: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          recording_retention_days?: number | null;
          transcript_retention_days?: number | null;
          analysis_retention_days?: number | null;
          soft_delete_grace_days?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_retention_policies"]["Insert"]>;
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          theme: string | null;
          email_notifications: boolean;
          in_app_notifications: boolean;
          timezone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: string | null;
          email_notifications?: boolean;
          in_app_notifications?: boolean;
          timezone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_preferences"]["Insert"]>;
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          company_id: string;
          email: string;
          role: AppRole;
          team_id: string | null;
          token: string;
          invited_by: string | null;
          status: string;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          email: string;
          role?: AppRole;
          team_id?: string | null;
          token: string;
          invited_by?: string | null;
          status?: string;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invitations"]["Insert"]>;
        Relationships: [];
      };
      onboarding_checklists: {
        Row: {
          company_id: string;
          company_profile_done: boolean;
          sales_process_done: boolean;
          team_invites_done: boolean;
          calls_setup_done: boolean;
          ai_config_done: boolean;
          crm_setup_done: boolean;
          sample_call_done: boolean;
          completed_at: string | null;
          wizard_state: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          company_id: string;
          company_profile_done?: boolean;
          sales_process_done?: boolean;
          team_invites_done?: boolean;
          calls_setup_done?: boolean;
          ai_config_done?: boolean;
          crm_setup_done?: boolean;
          sample_call_done?: boolean;
          completed_at?: string | null;
          wizard_state?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["onboarding_checklists"]["Insert"]>;
        Relationships: [];
      };
      scorecards: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          is_default: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          is_default?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["scorecards"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          company_id: string | null;
          actor_user_id: string | null;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          actor_user_id?: string | null;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_company_id: { Args: Record<string, never>; Returns: string };
      active_company_id: { Args: Record<string, never>; Returns: string };
      is_member_of: { Args: { _company_id: string }; Returns: boolean };
      member_role: { Args: { _company_id: string }; Returns: AppRole };
      has_role: {
        Args: { _role: AppRole; _user_id: string };
        Returns: boolean;
      };
      has_company_role: {
        Args: { _company_id: string; _roles: AppRole[] };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: Record<string, never>;
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;
