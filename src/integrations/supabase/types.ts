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
      answer_likes: {
        Row: {
          answer_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          answer_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          answer_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_likes_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          content: string
          created_at: string
          id: string
          is_accepted: boolean
          is_hidden: boolean
          likes_count: number
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_accepted?: boolean
          is_hidden?: boolean
          likes_count?: number
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_accepted?: boolean
          is_hidden?: boolean
          likes_count?: number
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_likes: {
        Row: {
          created_at: string
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "topic_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      drafts: {
        Row: {
          bounty_points: number | null
          category: string | null
          content: string | null
          created_at: string
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bounty_points?: number | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bounty_points?: number | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      experts: {
        Row: {
          available_time_slots: Json | null
          avatar_url: string | null
          bio: string | null
          category: string | null
          consultation_price: number | null
          consultation_count: number | null
          cover_image: string | null
          created_at: string | null
          display_name: string | null
          education: Json | null
          experience_level: string | null
          experience: Json | null
          followers_count: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          keywords: string[] | null
          location: string | null
          order_count: number | null
          rating: number | null
          response_rate: number | null
          response_time: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_time_slots?: Json | null
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          consultation_price?: number | null
          consultation_count?: number | null
          cover_image?: string | null
          created_at?: string | null
          display_name?: string | null
          education?: Json | null
          experience_level?: string | null
          experience?: Json | null
          followers_count?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          keywords?: string[] | null
          location?: string | null
          order_count?: number | null
          rating?: number | null
          response_rate?: number | null
          response_time?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_time_slots?: Json | null
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          consultation_price?: number | null
          consultation_count?: number | null
          cover_image?: string | null
          created_at?: string | null
          display_name?: string | null
          education?: Json | null
          experience_level?: string | null
          experience?: Json | null
          followers_count?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          keywords?: string[] | null
          location?: string | null
          order_count?: number | null
          rating?: number | null
          response_rate?: number | null
          response_time?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          images: string[] | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          type?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      hot_topics: {
        Row: {
          category: string | null
          cover_image: string | null
          created_at: string
          created_by: string
          description: string | null
          discussions_count: number
          id: string
          is_active: boolean
          participants_count: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          cover_image?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          discussions_count?: number
          id?: string
          is_active?: boolean
          participants_count?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          cover_image?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          discussions_count?: number
          id?: string
          is_active?: boolean
          participants_count?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_hidden: boolean
          message_type: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          message_type?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          message_type?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          related_id: string | null
          related_type: string | null
          sender_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          sender_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          sender_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          cash_amount: number | null
          created_at: string
          id: string
          metadata: Json
          order_type: string
          paid_at: string | null
          payment_method: string | null
          provider_order_id: string | null
          provider_transaction_id: string | null
          related_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          cash_amount?: number | null
          created_at?: string
          id?: string
          metadata?: Json
          order_type: string
          paid_at?: string | null
          payment_method?: string | null
          provider_order_id?: string | null
          provider_transaction_id?: string | null
          related_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          cash_amount?: number | null
          created_at?: string
          id?: string
          metadata?: Json
          order_type?: string
          paid_at?: string | null
          payment_method?: string | null
          provider_order_id?: string | null
          provider_transaction_id?: string | null
          related_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      point_accounts: {
        Row: {
          available_balance: number
          created_at: string
          frozen_balance: number
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          frozen_balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          frozen_balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          biz_id: string | null
          biz_type: string
          created_at: string
          direction: "credit" | "debit"
          id: string
          idempotency_key: string | null
          note: string | null
          order_id: string | null
          point_account_id: string
          status: "pending" | "completed" | "failed" | "reversed"
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          biz_id?: string | null
          biz_type: string
          created_at?: string
          direction: "credit" | "debit"
          id?: string
          idempotency_key?: string | null
          note?: string | null
          order_id?: string | null
          point_account_id: string
          status?: "pending" | "completed" | "failed" | "reversed"
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          biz_id?: string | null
          biz_type?: string
          created_at?: string
          direction?: "credit" | "debit"
          id?: string
          idempotency_key?: string | null
          note?: string | null
          order_id?: string | null
          point_account_id?: string
          status?: "pending" | "completed" | "failed" | "reversed"
          user_id?: string
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          related_id: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          related_id?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          related_id?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      earning_transactions: {
        Row: {
          amount: number
          biz_id: string | null
          biz_type: string
          created_at: string
          direction: "income" | "expense" | "adjustment"
          id: string
          note: string | null
          order_id: string | null
          settled_at: string | null
          status: "pending" | "available" | "settled" | "reversed"
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          biz_id?: string | null
          biz_type: string
          created_at?: string
          direction?: "income" | "expense" | "adjustment"
          id?: string
          note?: string | null
          order_id?: string | null
          settled_at?: string | null
          status?: "pending" | "available" | "settled" | "reversed"
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          biz_id?: string | null
          biz_type?: string
          created_at?: string
          direction?: "income" | "expense" | "adjustment"
          id?: string
          note?: string | null
          order_id?: string | null
          settled_at?: string | null
          status?: "pending" | "available" | "settled" | "reversed"
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          images: string[] | null
          likes_count: number
          shares_count: number
          topics: string[] | null
          updated_at: string
          user_id: string
          video: string | null
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          likes_count?: number
          shares_count?: number
          topics?: string[] | null
          updated_at?: string
          user_id: string
          video?: string | null
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          likes_count?: number
          shares_count?: number
          topics?: string[] | null
          updated_at?: string
          user_id?: string
          video?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          cover_url: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          nickname: string | null
          phone: string | null
          points_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nickname?: string | null
          phone?: string | null
          points_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nickname?: string | null
          phone?: string | null
          points_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          bounty_points: number
          category: string | null
          content: string | null
          created_at: string
          id: string
          is_hidden: boolean
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          bounty_points?: number
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_hidden?: boolean
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          bounty_points?: number
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_hidden?: boolean
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number
        }
        Relationships: []
      }
      talent_certifications: {
        Row: {
          cert_type: string
          created_at: string
          details: Json | null
          id: string
          reviewed_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cert_type: string
          created_at?: string
          details?: Json | null
          id?: string
          reviewed_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cert_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          reviewed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      topic_discussions: {
        Row: {
          content: string
          created_at: string
          id: string
          is_hidden: boolean
          likes_count: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          likes_count?: number
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          likes_count?: number
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_discussions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "hot_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_followers: {
        Row: {
          created_at: string | null
          id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_followers_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "hot_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          notification_settings: Json
          privacy_settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_settings?: Json
          privacy_settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_settings?: Json
          privacy_settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_answer_and_transfer_points: {
        Args: { p_answer_id: string; p_question_id: string }
        Returns: undefined
      }
      admin_confirm_recharge_order: {
        Args: { p_order_id: string; p_provider_transaction_id?: string | null }
        Returns: boolean
      }
      apply_content_moderation_action: {
        Args: {
          p_action: string
          p_reason?: string | null
          p_report_id?: string | null
          p_target_id: string
          p_target_type: string
        }
        Returns: boolean
      }
      create_consultation_order: {
        Args: { p_consult_type?: string; p_expert_id: string }
        Returns: string
      }
      create_question_secure: {
        Args: {
          p_bounty_points?: number
          p_category?: string | null
          p_content?: string | null
          p_tags?: string[] | null
          p_title: string
        }
        Returns: string
      }
      create_answer_secure: {
        Args: { p_content: string; p_question_id: string }
        Returns: string
      }
      create_recharge_payment_order: {
        Args: { p_payment_method?: string; p_points: number }
        Returns: Json
      }
      create_topic_discussion_secure: {
        Args: { p_content: string; p_topic_id: string }
        Returns: string
      }
      get_admin_dashboard: {
        Args: never
        Returns: Json
      }
      get_app_configs: {
        Args: never
        Returns: Json
      }
      get_nearby_experts: {
        Args: { p_lat: number; p_lng: number; p_radius_km?: number }
        Returns: {
          avatar_url: string | null
          bio: string | null
          category: string | null
          consultation_count: number | null
          display_name: string | null
          distance_km: number
          expert_id: string
          followers_count: number | null
          is_verified: boolean | null
          location: string | null
          order_count: number | null
          rating: number | null
          response_rate: number | null
          title: string
          user_id: string
        }[]
      }
      get_user_conversations: {
        Args: never
        Returns: {
          last_message: string
          last_message_time: string
          partner_avatar: string | null
          partner_id: string
          partner_nickname: string | null
          unread_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_content_reports: {
        Args: { p_status?: string | null }
        Returns: Json
      }
      list_pending_recharge_orders: {
        Args: never
        Returns: Json
      }
      mark_notifications_read: {
        Args: { p_notification_ids?: string[] | null }
        Returns: number
      }
      review_content_report: {
        Args: {
          p_report_id: string
          p_resolution_note?: string | null
          p_status: string
        }
        Returns: boolean
      }
      recharge_points: {
        Args: { p_amount: number; p_payment_method?: string }
        Returns: undefined
      }
      search_app_content: {
        Args: { p_limit?: number; p_query: string }
        Returns: Json
      }
      send_direct_message: {
        Args: { p_content: string; p_message_type?: string; p_receiver_id: string }
        Returns: string
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      submit_content_report: {
        Args: {
          p_details?: string | null
          p_reason: string
          p_target_id: string
          p_target_type: string
        }
        Returns: string
      }
      upsert_app_config: {
        Args: { p_description?: string | null; p_key: string; p_value: Json }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
