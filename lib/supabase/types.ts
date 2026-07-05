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
      cycle_stockings: {
        Row: {
          created_at: string
          created_by: string | null
          cycle_id: string
          fish_count: number
          id: string
          pond_id: string
          stocking_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          cycle_id: string
          fish_count: number
          id?: string
          pond_id: string
          stocking_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          cycle_id?: string
          fish_count?: number
          id?: string
          pond_id?: string
          stocking_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "cycle_stockings_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycle_summary"
            referencedColumns: ["cycle_id"]
          },
          {
            foreignKeyName: "cycle_stockings_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "production_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cycle_stockings_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "pond_current_stock"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "cycle_stockings_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "pond_mortality_7d"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "cycle_stockings_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          created_at: string
          created_by: string
          cycle_id: string
          id: string
          log_date: string
          notes: string | null
          pond_id: string
          water_ph: number | null
          water_temp_c: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          cycle_id: string
          id?: string
          log_date: string
          notes?: string | null
          pond_id: string
          water_ph?: number | null
          water_temp_c?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          cycle_id?: string
          id?: string
          log_date?: string
          notes?: string | null
          pond_id?: string
          water_ph?: number | null
          water_temp_c?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycle_summary"
            referencedColumns: ["cycle_id"]
          },
          {
            foreignKeyName: "daily_logs_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "production_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "pond_current_stock"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "daily_logs_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "pond_mortality_7d"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "daily_logs_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_entries: {
        Row: {
          created_at: string
          created_by: string
          daily_log_id: string
          feed_type: string
          id: string
          quantity_kg: number
        }
        Insert: {
          created_at?: string
          created_by: string
          daily_log_id: string
          feed_type: string
          id?: string
          quantity_kg: number
        }
        Update: {
          created_at?: string
          created_by?: string
          daily_log_id?: string
          feed_type?: string
          id?: string
          quantity_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "feed_entries_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_entries_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "pond_daily_log"
            referencedColumns: ["daily_log_id"]
          },
        ]
      }
      harvests: {
        Row: {
          buyer: string | null
          created_at: string
          created_by: string
          cycle_id: string
          fish_count: number
          harvest_date: string
          id: string
          notes: string | null
          pond_id: string
          quantity_kg: number
          revenue: number | null
        }
        Insert: {
          buyer?: string | null
          created_at?: string
          created_by: string
          cycle_id: string
          fish_count: number
          harvest_date: string
          id?: string
          notes?: string | null
          pond_id: string
          quantity_kg: number
          revenue?: number | null
        }
        Update: {
          buyer?: string | null
          created_at?: string
          created_by?: string
          cycle_id?: string
          fish_count?: number
          harvest_date?: string
          id?: string
          notes?: string | null
          pond_id?: string
          quantity_kg?: number
          revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "harvests_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycle_summary"
            referencedColumns: ["cycle_id"]
          },
          {
            foreignKeyName: "harvests_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "production_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "harvests_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "pond_current_stock"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "harvests_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "pond_mortality_7d"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "harvests_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
        ]
      }
      mortality_entries: {
        Row: {
          count: number
          created_at: string
          created_by: string
          daily_log_id: string
          id: string
          suspected_cause: string | null
        }
        Insert: {
          count: number
          created_at?: string
          created_by: string
          daily_log_id: string
          id?: string
          suspected_cause?: string | null
        }
        Update: {
          count?: number
          created_at?: string
          created_by?: string
          daily_log_id?: string
          id?: string
          suspected_cause?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mortality_entries_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mortality_entries_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "pond_daily_log"
            referencedColumns: ["daily_log_id"]
          },
        ]
      }
      ponds: {
        Row: {
          code: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          status: string
          type: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          status?: string
          type?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      production_cycles: {
        Row: {
          created_at: string
          created_by: string | null
          end_date: string | null
          id: string
          species: string
          start_date: string
          status: string
          unaccounted_loss: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          species: string
          start_date: string
          status?: string
          unaccounted_loss?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          species?: string
          start_date?: string
          status?: string
          unaccounted_loss?: number
        }
        Relationships: []
      }
      stock_transfers: {
        Row: {
          count: number
          created_at: string
          created_by: string | null
          cycle_id: string
          from_pond_id: string
          id: string
          notes: string | null
          to_pond_id: string
          transfer_date: string
        }
        Insert: {
          count: number
          created_at?: string
          created_by?: string | null
          cycle_id: string
          from_pond_id: string
          id?: string
          notes?: string | null
          to_pond_id: string
          transfer_date: string
        }
        Update: {
          count?: number
          created_at?: string
          created_by?: string | null
          cycle_id?: string
          from_pond_id?: string
          id?: string
          notes?: string | null
          to_pond_id?: string
          transfer_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_transfers_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycle_summary"
            referencedColumns: ["cycle_id"]
          },
          {
            foreignKeyName: "stock_transfers_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "production_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_from_pond_id_fkey"
            columns: ["from_pond_id"]
            isOneToOne: false
            referencedRelation: "pond_current_stock"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "stock_transfers_from_pond_id_fkey"
            columns: ["from_pond_id"]
            isOneToOne: false
            referencedRelation: "pond_mortality_7d"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "stock_transfers_from_pond_id_fkey"
            columns: ["from_pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_to_pond_id_fkey"
            columns: ["to_pond_id"]
            isOneToOne: false
            referencedRelation: "pond_current_stock"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "stock_transfers_to_pond_id_fkey"
            columns: ["to_pond_id"]
            isOneToOne: false
            referencedRelation: "pond_mortality_7d"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "stock_transfers_to_pond_id_fkey"
            columns: ["to_pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      cycle_summary: {
        Row: {
          cycle_id: string | null
          end_date: string | null
          species: string | null
          start_date: string | null
          status: string | null
          total_harvested: number | null
          total_mortality: number | null
          total_remaining: number | null
          total_stocked: number | null
          unaccounted_loss: number | null
        }
        Relationships: []
      }
      farm_total_fish: {
        Row: {
          total_fish_in_farm: number | null
        }
        Relationships: []
      }
      feed_used_rollups: {
        Row: {
          feed_kg_30d: number | null
          feed_kg_7d: number | null
        }
        Relationships: []
      }
      harvest_mtd_rollup: {
        Row: {
          harvest_fish_mtd: number | null
          harvest_kg_mtd: number | null
          harvest_revenue_mtd: number | null
        }
        Relationships: []
      }
      harvest_totals: {
        Row: {
          total_quantity: number | null
          total_revenue: number | null
          total_weight_kg: number | null
        }
        Relationships: []
      }
      mortality_rollups: {
        Row: {
          mortality_30d: number | null
          mortality_7d: number | null
        }
        Relationships: []
      }
      pond_current_stock: {
        Row: {
          current_fish_count: number | null
          cycle_id: string | null
          pond_code: string | null
          pond_id: string | null
          pond_name: string | null
          species: string | null
          status: string | null
          total_harvested: number | null
          total_mortality: number | null
          type: string | null
        }
        Relationships: []
      }
      pond_cycle_stock: {
        Row: {
          current_fish_count: number | null
          cycle_id: string | null
          pond_id: string | null
          stocked_in: number | null
          total_harvested: number | null
          total_mortality: number | null
          transferred_in: number | null
          transferred_out: number | null
        }
        Relationships: []
      }
      pond_daily_log: {
        Row: {
          daily_log_id: string | null
          feed_kg_total: number | null
          log_date: string | null
          mortality_total: number | null
          notes: string | null
          pond_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "pond_current_stock"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "daily_logs_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "pond_mortality_7d"
            referencedColumns: ["pond_id"]
          },
          {
            foreignKeyName: "daily_logs_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
        ]
      }
      pond_mortality_7d: {
        Row: {
          mortality_last_7d: number | null
          pond_id: string | null
          pond_name: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_cycle_with_stockings: {
        Args: {
          p_created_by: string
          p_species: string
          p_start_date: string
          p_stockings: Json
        }
        Returns: string
      }
      create_daily_log_with_entries: {
        Args: {
          p_created_by: string
          p_feed_quantity_kg: number
          p_feed_type: string
          p_log_date: string
          p_mortality_count: number
          p_notes: string
          p_pond_id: string
          p_suspected_cause: string
          p_water_ph: number
          p_water_temp_c: number
        }
        Returns: Json
      }
      end_cycle: {
        Args: { p_cycle_id: string; p_end_date: string }
        Returns: undefined
      }
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
