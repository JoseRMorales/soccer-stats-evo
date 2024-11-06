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
      Assists: {
        Row: {
          amount: number
          player: number
          round: number
          season: string
        }
        Insert: {
          amount?: number
          player: number
          round: number
          season: string
        }
        Update: {
          amount?: number
          player?: number
          round?: number
          season?: string
        }
        Relationships: [
          {
            foreignKeyName: "Assists_player_season_fkey"
            columns: ["player", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
          {
            foreignKeyName: "Assists_season_round_fkey"
            columns: ["season", "round"]
            isOneToOne: false
            referencedRelation: "Matches"
            referencedColumns: ["season", "round"]
          },
        ]
      }
      Goals: {
        Row: {
          amount: number
          goal_type: string
          player: number
          round: number
          season: string
        }
        Insert: {
          amount?: number
          goal_type?: string
          player: number
          round: number
          season: string
        }
        Update: {
          amount?: number
          goal_type?: string
          player?: number
          round?: number
          season?: string
        }
        Relationships: [
          {
            foreignKeyName: "Goals_player_season_fkey"
            columns: ["player", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
          {
            foreignKeyName: "Goals_season_round_fkey"
            columns: ["season", "round"]
            isOneToOne: false
            referencedRelation: "Matches"
            referencedColumns: ["season", "round"]
          },
        ]
      }
      Lineups: {
        Row: {
          player: number
          position: number | null
          round: number
          season: string
        }
        Insert: {
          player: number
          position?: number | null
          round: number
          season: string
        }
        Update: {
          player?: number
          position?: number | null
          round?: number
          season?: string
        }
        Relationships: [
          {
            foreignKeyName: "Lineups_player_season_fkey"
            columns: ["player", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
          {
            foreignKeyName: "Lineups_season_round_fkey"
            columns: ["season", "round"]
            isOneToOne: false
            referencedRelation: "Matches"
            referencedColumns: ["season", "round"]
          },
        ]
      }
      Matches: {
        Row: {
          date: string | null
          goals_conceded: number | null
          goals_scored: number | null
          mvp: number | null
          opponent: string
          played: boolean
          round: number
          season: string
          time: string | null
        }
        Insert: {
          date?: string | null
          goals_conceded?: number | null
          goals_scored?: number | null
          mvp?: number | null
          opponent: string
          played?: boolean
          round: number
          season: string
          time?: string | null
        }
        Update: {
          date?: string | null
          goals_conceded?: number | null
          goals_scored?: number | null
          mvp?: number | null
          opponent?: string
          played?: boolean
          round?: number
          season?: string
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Matches_mvp_season_fkey"
            columns: ["mvp", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
          {
            foreignKeyName: "Matches_opponent_fkey"
            columns: ["opponent"]
            isOneToOne: false
            referencedRelation: "Teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Matches_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "Seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Matches_season_fkey1"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "Seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      MVPVotes: {
        Row: {
          player_voted: number | null
          round: number
          season: string
          voted_at: string
          voter: number
        }
        Insert: {
          player_voted?: number | null
          round: number
          season: string
          voted_at?: string
          voter: number
        }
        Update: {
          player_voted?: number | null
          round?: number
          season?: string
          voted_at?: string
          voter?: number
        }
        Relationships: [
          {
            foreignKeyName: "MVPVotes_player_voted_season_fkey"
            columns: ["player_voted", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
          {
            foreignKeyName: "MVPVotes_season_round_fkey"
            columns: ["season", "round"]
            isOneToOne: false
            referencedRelation: "Matches"
            referencedColumns: ["season", "round"]
          },
          {
            foreignKeyName: "MVPVotes_voter_season_fkey"
            columns: ["voter", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
        ]
      }
      PenaltiesAgainst: {
        Row: {
          amount: number
          player: number
          round: number
          saved: number
          season: string
        }
        Insert: {
          amount?: number
          player: number
          round: number
          saved?: number
          season: string
        }
        Update: {
          amount?: number
          player?: number
          round?: number
          saved?: number
          season?: string
        }
        Relationships: [
          {
            foreignKeyName: "SavedPenalties_player_season_fkey"
            columns: ["player", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
          {
            foreignKeyName: "SavedPenalties_season_round_fkey"
            columns: ["season", "round"]
            isOneToOne: false
            referencedRelation: "Matches"
            referencedColumns: ["season", "round"]
          },
        ]
      }
      Players: {
        Row: {
          name: string
          number: number
          season: string
        }
        Insert: {
          name: string
          number: number
          season: string
        }
        Update: {
          name?: string
          number?: number
          season?: string
        }
        Relationships: [
          {
            foreignKeyName: "Players_season_fkey"
            columns: ["season"]
            isOneToOne: false
            referencedRelation: "Seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      RedCards: {
        Row: {
          player: number
          round: number
          season: string
        }
        Insert: {
          player: number
          round: number
          season: string
        }
        Update: {
          player?: number
          round?: number
          season?: string
        }
        Relationships: [
          {
            foreignKeyName: "RedCards_player_season_fkey"
            columns: ["player", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
          {
            foreignKeyName: "RedCards_season_round_fkey"
            columns: ["season", "round"]
            isOneToOne: false
            referencedRelation: "Matches"
            referencedColumns: ["season", "round"]
          },
        ]
      }
      Seasons: {
        Row: {
          id: string
        }
        Insert: {
          id?: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      Teams: {
        Row: {
          id: string
          name: string
          owner: boolean
        }
        Insert: {
          id?: string
          name: string
          owner: boolean
        }
        Update: {
          id?: string
          name?: string
          owner?: boolean
        }
        Relationships: []
      }
      YellowCards: {
        Row: {
          amount: number
          player: number
          round: number
          season: string
        }
        Insert: {
          amount?: number
          player: number
          round: number
          season: string
        }
        Update: {
          amount?: number
          player?: number
          round?: number
          season?: string
        }
        Relationships: [
          {
            foreignKeyName: "YellowCards_player_season_fkey"
            columns: ["player", "season"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["number", "season"]
          },
          {
            foreignKeyName: "YellowCards_season_round_fkey"
            columns: ["season", "round"]
            isOneToOne: false
            referencedRelation: "Matches"
            referencedColumns: ["season", "round"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_assists_number: {
        Args: {
          input_season: string
          input_player: number
        }
        Returns: {
          assists: number
        }[]
      }
      get_goals_number: {
        Args: {
          input_season: string
          input_player: number
        }
        Returns: {
          goals: number
        }[]
      }
      get_match_assists: {
        Args: {
          input_season: string
          input_round: number
        }
        Returns: {
          player_name: string
          assists_amount: number
        }[]
      }
      get_match_lineup: {
        Args: {
          input_season: string
          input_round: number
        }
        Returns: {
          player_number: number
          player_position: number
        }[]
      }
      get_match_red_cards: {
        Args: {
          input_season: string
          input_round: number
        }
        Returns: {
          player_name: string
        }[]
      }
      get_match_scorers: {
        Args: {
          input_season: string
          input_round: number
        }
        Returns: {
          player_name: string
          goals_amount: number
        }[]
      }
      get_match_stats: {
        Args: {
          input_season: string
          input_round: number
        }
        Returns: {
          stat_type: string
          player_name: string
          player_number: number
          goals: number
          assists: number
          yellow_cards: number
          red_cards: number
        }[]
      }
      get_match_yellow_cards: {
        Args: {
          input_season: string
          input_round: number
        }
        Returns: {
          player_name: string
          cards_amount: number
        }[]
      }
      get_penalties_saved: {
        Args: {
          input_season: string
          input_player: number
        }
        Returns: {
          saved_penalties: number
          total_penalties: number
        }[]
      }
      get_played_games: {
        Args: {
          input_season: string
          input_player: number
        }
        Returns: {
          played_matches: number
        }[]
      }
      get_player_stats: {
        Args: {
          season_input: string
          player_number: number
        }
        Returns: {
          season: string
          player_name: string
          played_matches: number
          total_goals: number
          total_assists: number
          total_penalties: number
          total_penalties_saved: number
          total_red_cards: number
          total_yellow_cards: number
        }[]
      }
      get_red_cards_number: {
        Args: {
          input_season: string
          input_player: number
        }
        Returns: {
          red_cards: number
        }[]
      }
      get_yellow_cards_number: {
        Args: {
          input_season: string
          input_player: number
        }
        Returns: {
          yellow_cards: number
        }[]
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
