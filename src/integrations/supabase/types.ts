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
      ai_feedback: {
        Row: {
          created_at: string
          feedback: string
          feedback_type: string
          focus_topics: Json | null
          id: string
          user_id: string
          weak_areas: Json | null
          week_id: string | null
        }
        Insert: {
          created_at?: string
          feedback: string
          feedback_type?: string
          focus_topics?: Json | null
          id?: string
          user_id: string
          weak_areas?: Json | null
          week_id?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string
          feedback_type?: string
          focus_topics?: Json | null
          id?: string
          user_id?: string
          weak_areas?: Json | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "roadmap_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          answers: Json
          assessment_type: string
          completed_at: string | null
          created_at: string
          id: string
          score: number | null
          user_id: string
        }
        Insert: {
          answers?: Json
          assessment_type: string
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_type?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_url: string | null
          id: string
          issued_at: string
          roadmap_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          id?: string
          issued_at?: string
          roadmap_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          id?: string
          issued_at?: string
          roadmap_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_progress: {
        Row: {
          completed_at: string | null
          concept_id: string
          created_at: string
          id: string
          is_completed: boolean
          practice_completed: boolean
          updated_at: string
          user_id: string
          video_completed: boolean
          video_watch_seconds: number
        }
        Insert: {
          completed_at?: string | null
          concept_id: string
          created_at?: string
          id?: string
          is_completed?: boolean
          practice_completed?: boolean
          updated_at?: string
          user_id: string
          video_completed?: boolean
          video_watch_seconds?: number
        }
        Update: {
          completed_at?: string | null
          concept_id?: string
          created_at?: string
          id?: string
          is_completed?: boolean
          practice_completed?: boolean
          updated_at?: string
          user_id?: string
          video_completed?: boolean
          video_watch_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "concept_progress_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      concepts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          user_id: string
          video_required_seconds: number
          video_url: string | null
          week_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          user_id: string
          video_required_seconds?: number
          video_url?: string | null
          week_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          user_id?: string
          video_required_seconds?: number
          video_url?: string | null
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concepts_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "roadmap_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress_logs: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          log_type: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          log_type: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          log_type?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_weeks: {
        Row: {
          description: string | null
          id: string
          is_current: boolean | null
          roadmap_id: string
          status: string
          title: string
          week_number: number
        }
        Insert: {
          description?: string | null
          id?: string
          is_current?: boolean | null
          roadmap_id: string
          status?: string
          title: string
          week_number: number
        }
        Update: {
          description?: string | null
          id?: string
          is_current?: boolean | null
          roadmap_id?: string
          status?: string
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_weeks_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          created_at: string
          description: string | null
          duration_weeks: number
          id: string
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks?: number
          id?: string
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number
          id?: string
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_recommendations: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_completed: boolean | null
          order_index: number | null
          task_type: string
          title: string
          user_id: string
          week_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean | null
          order_index?: number | null
          task_type?: string
          title: string
          user_id: string
          week_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean | null
          order_index?: number | null
          task_type?: string
          title?: string
          user_id?: string
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "roadmap_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          answers: Json
          created_at: string
          id: string
          passed: boolean
          score: number
          test_id: string
          user_id: string
          week_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          passed?: boolean
          score?: number
          test_id: string
          user_id: string
          week_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          passed?: boolean
          score?: number
          test_id?: string
          user_id?: string
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "weekly_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "roadmap_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string
          experience_level: string | null
          id: string
          target_role: string
          updated_at: string
          user_id: string
          weekly_hours: number
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          id?: string
          target_role: string
          updated_at?: string
          user_id: string
          weekly_hours?: number
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          id?: string
          target_role?: string
          updated_at?: string
          user_id?: string
          weekly_hours?: number
        }
        Relationships: []
      }
      weekly_reports: {
        Row: {
          ai_feedback: string | null
          created_at: string
          hours_spent: number | null
          id: string
          progress_score: number | null
          tasks_completed: number | null
          user_id: string
          week_number: number
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string
          hours_spent?: number | null
          id?: string
          progress_score?: number | null
          tasks_completed?: number | null
          user_id: string
          week_number: number
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string
          hours_spent?: number | null
          id?: string
          progress_score?: number | null
          tasks_completed?: number | null
          user_id?: string
          week_number?: number
        }
        Relationships: []
      }
      weekly_tests: {
        Row: {
          created_at: string
          id: string
          pass_threshold: number
          questions: Json
          user_id: string
          week_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pass_threshold?: number
          questions?: Json
          user_id: string
          week_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pass_threshold?: number
          questions?: Json
          user_id?: string
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_tests_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "roadmap_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
