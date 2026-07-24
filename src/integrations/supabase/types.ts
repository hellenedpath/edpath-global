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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cip_codes: {
        Row: {
          area_group: string | null
          category: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          area_group?: string | null
          category?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          area_group?: string | null
          category?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      english_schools: {
        Row: {
          application_url: string | null
          can_work: string | null
          city: string | null
          cost_per_week: string | null
          country: string | null
          course_types: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          exam_prep: string | null
          id: string
          languages_canada: boolean | null
          min_age: string | null
          name: string
          notes_en: string | null
          notes_pt: string | null
          pathway: string | null
          phone: string | null
          province: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          application_url?: string | null
          can_work?: string | null
          city?: string | null
          cost_per_week?: string | null
          country?: string | null
          course_types?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          exam_prep?: string | null
          id?: string
          languages_canada?: boolean | null
          min_age?: string | null
          name: string
          notes_en?: string | null
          notes_pt?: string | null
          pathway?: string | null
          phone?: string | null
          province?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          application_url?: string | null
          can_work?: string | null
          city?: string | null
          cost_per_week?: string | null
          country?: string | null
          course_types?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          exam_prep?: string | null
          id?: string
          languages_canada?: boolean | null
          min_age?: string | null
          name?: string
          notes_en?: string | null
          notes_pt?: string | null
          pathway?: string | null
          phone?: string | null
          province?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      high_schools: {
        Row: {
          application_fee: string | null
          boarding: string | null
          boarding_en: string | null
          boarding_pt: string | null
          city: string | null
          country: string | null
          created_at: string | null
          diploma: string | null
          diploma_en: string | null
          diploma_pt: string | null
          email: string | null
          grades: string | null
          homestay: string | null
          homestay_en: string | null
          homestay_pt: string | null
          id: string
          level: string | null
          name: string
          notes: string | null
          notes_en: string | null
          notes_pt: string | null
          phone: string | null
          province: string | null
          region: string | null
          school_type: string | null
          tuition_annual: string | null
          tuition_en: string | null
          tuition_pt: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          application_fee?: string | null
          boarding?: string | null
          boarding_en?: string | null
          boarding_pt?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          diploma?: string | null
          diploma_en?: string | null
          diploma_pt?: string | null
          email?: string | null
          grades?: string | null
          homestay?: string | null
          homestay_en?: string | null
          homestay_pt?: string | null
          id?: string
          level?: string | null
          name: string
          notes?: string | null
          notes_en?: string | null
          notes_pt?: string | null
          phone?: string | null
          province?: string | null
          region?: string | null
          school_type?: string | null
          tuition_annual?: string | null
          tuition_en?: string | null
          tuition_pt?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          application_fee?: string | null
          boarding?: string | null
          boarding_en?: string | null
          boarding_pt?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          diploma?: string | null
          diploma_en?: string | null
          diploma_pt?: string | null
          email?: string | null
          grades?: string | null
          homestay?: string | null
          homestay_en?: string | null
          homestay_pt?: string | null
          id?: string
          level?: string | null
          name?: string
          notes?: string | null
          notes_en?: string | null
          notes_pt?: string | null
          phone?: string | null
          province?: string | null
          region?: string | null
          school_type?: string | null
          tuition_annual?: string | null
          tuition_en?: string | null
          tuition_pt?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      institutions: {
        Row: {
          city: string | null
          country: string
          created_at: string
          display_name: string | null
          id: string
          name: string
          province: string
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          country: string
          created_at?: string
          display_name?: string | null
          id?: string
          name: string
          province: string
          type: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          country?: string
          created_at?: string
          display_name?: string | null
          id?: string
          name?: string
          province?: string
          type?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      occupations: {
        Row: {
          created_at: string
          id: string
          noc_code: string | null
          outlook: string | null
          province: string | null
          salary_high: string | null
          salary_low: string | null
          salary_median: string | null
          source_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          noc_code?: string | null
          outlook?: string | null
          province?: string | null
          salary_high?: string | null
          salary_low?: string | null
          salary_median?: string | null
          source_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          noc_code?: string | null
          outlook?: string | null
          province?: string | null
          salary_high?: string | null
          salary_low?: string | null
          salary_median?: string | null
          source_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "occupations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          application_url: string | null
          book_meeting_url: string | null
          campus_city: string | null
          cip_code: string | null
          created_at: string
          credential: string | null
          duration_months: number | null
          english_admission_tests: Json | null
          field_area: string | null
          has_coop: boolean
          id: string
          institution_id: string
          intl_office_url: string | null
          min_grade: string | null
          name: string
          occupation_ids: string[] | null
          open_to_international: boolean
          pgwp_basis: string | null
          pgwp_eligible: string | null
          pgwp_english_clb: number | null
          prerequisites: string | null
          source_id: string | null
          study_permit_eligible: string | null
          tuition_intl_year: string | null
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          book_meeting_url?: string | null
          campus_city?: string | null
          cip_code?: string | null
          created_at?: string
          credential?: string | null
          duration_months?: number | null
          english_admission_tests?: Json | null
          field_area?: string | null
          has_coop?: boolean
          id?: string
          institution_id: string
          intl_office_url?: string | null
          min_grade?: string | null
          name: string
          occupation_ids?: string[] | null
          open_to_international?: boolean
          pgwp_basis?: string | null
          pgwp_eligible?: string | null
          pgwp_english_clb?: number | null
          prerequisites?: string | null
          source_id?: string | null
          study_permit_eligible?: string | null
          tuition_intl_year?: string | null
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          book_meeting_url?: string | null
          campus_city?: string | null
          cip_code?: string | null
          created_at?: string
          credential?: string | null
          duration_months?: number | null
          english_admission_tests?: Json | null
          field_area?: string | null
          has_coop?: boolean
          id?: string
          institution_id?: string
          intl_office_url?: string | null
          min_grade?: string | null
          name?: string
          occupation_ids?: string[] | null
          open_to_international?: boolean
          pgwp_basis?: string | null
          pgwp_eligible?: string | null
          pgwp_english_clb?: number | null
          prerequisites?: string | null
          source_id?: string | null
          study_permit_eligible?: string | null
          tuition_intl_year?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      programs_staging: {
        Row: {
          application_url: string | null
          book_meeting_url: string | null
          campus_city: string | null
          cip_code: string | null
          confidence: string | null
          created_at: string
          credential: string | null
          duration_months: number | null
          english_admission_tests: Json | null
          extracted_at: string | null
          field_area: string | null
          field_confidence: Json | null
          has_coop: boolean | null
          id: string
          institution_id: string | null
          intl_office_url: string | null
          min_grade: string | null
          name: string | null
          occupation_ids: string[] | null
          open_to_international: boolean | null
          pgwp_basis: string | null
          pgwp_eligible: boolean | null
          pgwp_english_clb: string | null
          prerequisites: string | null
          promoted_program_id: string | null
          raw_source_url: string | null
          review_notes: string | null
          review_status: string
          source_id: string | null
          tuition_intl_year: number | null
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          book_meeting_url?: string | null
          campus_city?: string | null
          cip_code?: string | null
          confidence?: string | null
          created_at?: string
          credential?: string | null
          duration_months?: number | null
          english_admission_tests?: Json | null
          extracted_at?: string | null
          field_area?: string | null
          field_confidence?: Json | null
          has_coop?: boolean | null
          id?: string
          institution_id?: string | null
          intl_office_url?: string | null
          min_grade?: string | null
          name?: string | null
          occupation_ids?: string[] | null
          open_to_international?: boolean | null
          pgwp_basis?: string | null
          pgwp_eligible?: boolean | null
          pgwp_english_clb?: string | null
          prerequisites?: string | null
          promoted_program_id?: string | null
          raw_source_url?: string | null
          review_notes?: string | null
          review_status?: string
          source_id?: string | null
          tuition_intl_year?: number | null
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          book_meeting_url?: string | null
          campus_city?: string | null
          cip_code?: string | null
          confidence?: string | null
          created_at?: string
          credential?: string | null
          duration_months?: number | null
          english_admission_tests?: Json | null
          extracted_at?: string | null
          field_area?: string | null
          field_confidence?: Json | null
          has_coop?: boolean | null
          id?: string
          institution_id?: string | null
          intl_office_url?: string | null
          min_grade?: string | null
          name?: string | null
          occupation_ids?: string[] | null
          open_to_international?: boolean | null
          pgwp_basis?: string | null
          pgwp_eligible?: boolean | null
          pgwp_english_clb?: string | null
          prerequisites?: string | null
          promoted_program_id?: string | null
          raw_source_url?: string | null
          review_notes?: string | null
          review_status?: string
          source_id?: string | null
          tuition_intl_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_staging_promoted_program_id_fkey"
            columns: ["promoted_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          created_at: string
          id: string
          last_checked: string | null
          next_check_due: string | null
          notes: string | null
          type: string | null
          url: string | null
          valid_as_of: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_checked?: string | null
          next_check_due?: string | null
          notes?: string | null
          type?: string | null
          url?: string | null
          valid_as_of?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_checked?: string | null
          next_check_due?: string | null
          notes?: string | null
          type?: string | null
          url?: string | null
          valid_as_of?: string | null
        }
        Relationships: []
      }
      wages: {
        Row: {
          data_source_en: string | null
          er_code: string | null
          geo_level: string
          id: string
          imported_at: string
          noc_code: string
          prov_code: string | null
          reference_period: string | null
          region_name_en: string | null
          region_name_fr: string | null
          revision_date: string | null
          wage_average: number | null
          wage_comment_en: string | null
          wage_high: number | null
          wage_low: number | null
          wage_median: number | null
          wage_q1: number | null
          wage_q3: number | null
          wage_unit: string
        }
        Insert: {
          data_source_en?: string | null
          er_code?: string | null
          geo_level: string
          id?: string
          imported_at?: string
          noc_code: string
          prov_code?: string | null
          reference_period?: string | null
          region_name_en?: string | null
          region_name_fr?: string | null
          revision_date?: string | null
          wage_average?: number | null
          wage_comment_en?: string | null
          wage_high?: number | null
          wage_low?: number | null
          wage_median?: number | null
          wage_q1?: number | null
          wage_q3?: number | null
          wage_unit: string
        }
        Update: {
          data_source_en?: string | null
          er_code?: string | null
          geo_level?: string
          id?: string
          imported_at?: string
          noc_code?: string
          prov_code?: string | null
          reference_period?: string | null
          region_name_en?: string | null
          region_name_fr?: string | null
          revision_date?: string | null
          wage_average?: number | null
          wage_comment_en?: string | null
          wage_high?: number | null
          wage_low?: number | null
          wage_median?: number | null
          wage_q1?: number | null
          wage_q3?: number | null
          wage_unit?: string
        }
        Relationships: []
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
