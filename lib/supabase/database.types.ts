export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: string | null
          phone: string | null
          avatar_url: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      dealers: {
        Row: {
          id: string
          name: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_email: string | null
          address: string | null
          commission_rate: number | null
          status: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          address?: string | null
          commission_rate?: number | null
          status?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          address?: string | null
          commission_rate?: number | null
          status?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          sender_id: string | null
          platform: string | null
          status: string | null
          phone_number: string | null
          phone_captured_at: string | null
          message_count: number | null
          bot_response_count: number | null
          last_intent: string | null
          urgency: string | null
          readiness: string | null
          created_at: string | null
          updated_at: string | null
          last_message_at: string | null
          closed_at: string | null
          close_reason: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          sender_id?: string | null
          platform?: string | null
          status?: string | null
          phone_number?: string | null
          phone_captured_at?: string | null
          message_count?: number | null
          bot_response_count?: number | null
          last_intent?: string | null
          urgency?: string | null
          readiness?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_message_at?: string | null
          closed_at?: string | null
          close_reason?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          sender_id?: string | null
          platform?: string | null
          status?: string | null
          phone_number?: string | null
          phone_captured_at?: string | null
          message_count?: number | null
          bot_response_count?: number | null
          last_intent?: string | null
          urgency?: string | null
          readiness?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_message_at?: string | null
          closed_at?: string | null
          close_reason?: string | null
          metadata?: Json | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          role: string | null
          content: string | null
          message_id: string | null
          timestamp: number | null
          context: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          role?: string | null
          content?: string | null
          message_id?: string | null
          timestamp?: number | null
          context?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          role?: string | null
          content?: string | null
          message_id?: string | null
          timestamp?: number | null
          context?: Json | null
          created_at?: string | null
        }
      }
      conversation_context: {
        Row: {
          id: string
          conversation_id: string | null
          vehicle_interest: string | null
          concerns: string[] | null
          topics_mentioned: string[] | null
          budget_range: string | null
          down_payment_capacity: string | null
          credit_situation: string | null
          urgency_indicators: string[] | null
          timeline: string | null
          location: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          vehicle_interest?: string | null
          concerns?: string[] | null
          topics_mentioned?: string[] | null
          budget_range?: string | null
          down_payment_capacity?: string | null
          credit_situation?: string | null
          urgency_indicators?: string[] | null
          timeline?: string | null
          location?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          vehicle_interest?: string | null
          concerns?: string[] | null
          topics_mentioned?: string[] | null
          budget_range?: string | null
          down_payment_capacity?: string | null
          credit_situation?: string | null
          urgency_indicators?: string[] | null
          timeline?: string | null
          location?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          conversation_id: string | null
          name: string | null
          phone: string | null
          source: string | null
          vehicle_interest: string | null
          budget_range: string | null
          status: string | null
          credit_score_range: string | null
          down_payment_available: boolean | null
          urgency_level: string | null
          last_contact_at: string | null
          next_follow_up_at: string | null
          follow_up_count: number | null
          assigned_to: string | null
          dealer_id: string | null
          deal_closed_at: string | null
          deal_amount: number | null
          commission_amount: number | null
          notes: string | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
          vehicle_interest?: string | null
          budget_range?: string | null
          status?: string | null
          credit_score_range?: string | null
          down_payment_available?: boolean | null
          urgency_level?: string | null
          last_contact_at?: string | null
          next_follow_up_at?: string | null
          follow_up_count?: number | null
          assigned_to?: string | null
          dealer_id?: string | null
          deal_closed_at?: string | null
          deal_amount?: number | null
          commission_amount?: number | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
          vehicle_interest?: string | null
          budget_range?: string | null
          status?: string | null
          credit_score_range?: string | null
          down_payment_available?: boolean | null
          urgency_level?: string | null
          last_contact_at?: string | null
          next_follow_up_at?: string | null
          follow_up_count?: number | null
          assigned_to?: string | null
          dealer_id?: string | null
          deal_closed_at?: string | null
          deal_amount?: number | null
          commission_amount?: number | null
          notes?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      interactions: {
        Row: {
          id: string
          lead_id: string | null
          user_id: string | null
          type: string | null
          content: string | null
          outcome: string | null
          duration_seconds: number | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          lead_id?: string | null
          user_id?: string | null
          type?: string | null
          content?: string | null
          outcome?: string | null
          duration_seconds?: number | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          lead_id?: string | null
          user_id?: string | null
          type?: string | null
          content?: string | null
          outcome?: string | null
          duration_seconds?: number | null
          metadata?: Json | null
          created_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          lead_id: string | null
          assigned_to: string | null
          title: string | null
          description: string | null
          task_type: string | null
          priority: string | null
          due_at: string | null
          status: string | null
          completed_at: string | null
          completed_by: string | null
          auto_generated: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          lead_id?: string | null
          assigned_to?: string | null
          title?: string | null
          description?: string | null
          task_type?: string | null
          priority?: string | null
          due_at?: string | null
          status?: string | null
          completed_at?: string | null
          completed_by?: string | null
          auto_generated?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          lead_id?: string | null
          assigned_to?: string | null
          title?: string | null
          description?: string | null
          task_type?: string | null
          priority?: string | null
          due_at?: string | null
          status?: string | null
          completed_at?: string | null
          completed_by?: string | null
          auto_generated?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          lead_id: string | null
          dealer_id: string | null
          scheduled_at: string | null
          duration_minutes: number | null
          status: string | null
          vehicle_interest: string | null
          appointment_type: string | null
          notes: string | null
          confirmed_at: string | null
          completed_at: string | null
          reminder_sent: boolean | null
          reminder_sent_at: string | null
          cancellation_reason: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          lead_id?: string | null
          dealer_id?: string | null
          scheduled_at?: string | null
          duration_minutes?: number | null
          status?: string | null
          vehicle_interest?: string | null
          appointment_type?: string | null
          notes?: string | null
          confirmed_at?: string | null
          completed_at?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          lead_id?: string | null
          dealer_id?: string | null
          scheduled_at?: string | null
          duration_minutes?: number | null
          status?: string | null
          vehicle_interest?: string | null
          appointment_type?: string | null
          notes?: string | null
          confirmed_at?: string | null
          completed_at?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
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
  }
}
