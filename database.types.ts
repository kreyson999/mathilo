export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      choice_options: {
        Row: {
          content: string
          id: number
          is_correct: boolean
          task_id: number | null
        }
        Insert: {
          content: string
          id?: number
          is_correct?: boolean
          task_id?: number | null
        }
        Update: {
          content?: string
          id?: number
          is_correct?: boolean
          task_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "choice_options_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      fill_in_tasks: {
        Row: {
          answer_order: number
          correct_answer: string
          id: number
          task_id: number | null
          template: string
        }
        Insert: {
          answer_order: number
          correct_answer: string
          id?: number
          task_id?: number | null
          template: string
        }
        Update: {
          answer_order?: number
          correct_answer?: string
          id?: number
          task_id?: number | null
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "fill_in_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      open_tasks: {
        Row: {
          solution: string | null
          solution_points_steps: string | null
          task_id: number
        }
        Insert: {
          solution?: string | null
          solution_points_steps?: string | null
          task_id: number
        }
        Update: {
          solution?: string | null
          solution_points_steps?: string | null
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "open_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      sheets: {
        Row: {
          created_at: string | null
          id: number
          is_practice: boolean
          name: string
          release_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_practice?: boolean
          name: string
          release_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_practice?: boolean
          name?: string
          release_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      task_statuses: {
        Row: {
          ai_messages: Json | null
          canvas_data: string | null
          created_at: string | null
          id: number
          is_completed: boolean | null
          received_points: number | null
          task_id: number
          updated_at: string | null
          user_answers: Json | null
          user_id: string
        }
        Insert: {
          ai_messages?: Json | null
          canvas_data?: string | null
          created_at?: string | null
          id?: number
          is_completed?: boolean | null
          received_points?: number | null
          task_id: number
          updated_at?: string | null
          user_answers?: Json | null
          user_id: string
        }
        Update: {
          ai_messages?: Json | null
          canvas_data?: string | null
          created_at?: string | null
          id?: number
          is_completed?: boolean | null
          received_points?: number | null
          task_id?: number
          updated_at?: string | null
          user_answers?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "draw_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category_id: number | null
          content: string
          created_at: string | null
          id: number
          image_path: string | null
          max_points: number
          sheet_id: number | null
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          content: string
          created_at?: string | null
          id?: number
          image_path?: string | null
          max_points: number
          sheet_id?: number | null
          type: Database["public"]["Enums"]["task_type"]
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          content?: string
          created_at?: string | null
          id?: number
          image_path?: string | null
          max_points?: number
          sheet_id?: number | null
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_sheet_id_fkey"
            columns: ["sheet_id"]
            isOneToOne: false
            referencedRelation: "sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      true_false_tasks: {
        Row: {
          id: number
          is_true: boolean
          statement: string
          statement_order: number
          task_id: number | null
        }
        Insert: {
          id?: number
          is_true: boolean
          statement: string
          statement_order: number
          task_id?: number | null
        }
        Update: {
          id?: number
          is_true?: boolean
          statement?: string
          statement_order?: number
          task_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "true_false_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_random_tasks: {
        Args: {
          p_type?: string[]
          p_category_id?: number
          p_sheet_id?: number
        }
        Returns: {
          category_id: number | null
          content: string
          created_at: string | null
          id: number
          image_path: string | null
          max_points: number
          sheet_id: number | null
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string | null
        }[]
      }
    }
    Enums: {
      task_type:
        | "single_choice"
        | "multiple_choice"
        | "open"
        | "true_false"
        | "fill_in"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
