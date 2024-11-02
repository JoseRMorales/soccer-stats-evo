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
            foreignKeyName: 'Assists_player_season_fkey'
            columns: ['player', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          },
          {
            foreignKeyName: 'Assists_season_round_fkey'
            columns: ['season', 'round']
            isOneToOne: false
            referencedRelation: 'Matches'
            referencedColumns: ['season', 'round']
          }
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
            foreignKeyName: 'Goals_player_season_fkey'
            columns: ['player', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          },
          {
            foreignKeyName: 'Goals_season_round_fkey'
            columns: ['season', 'round']
            isOneToOne: false
            referencedRelation: 'Matches'
            referencedColumns: ['season', 'round']
          }
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
            foreignKeyName: 'Lineups_player_season_fkey'
            columns: ['player', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          },
          {
            foreignKeyName: 'Lineups_season_round_fkey'
            columns: ['season', 'round']
            isOneToOne: false
            referencedRelation: 'Matches'
            referencedColumns: ['season', 'round']
          }
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
            foreignKeyName: 'Matches_mvp_season_fkey'
            columns: ['mvp', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          },
          {
            foreignKeyName: 'Matches_opponent_fkey'
            columns: ['opponent']
            isOneToOne: false
            referencedRelation: 'Teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Matches_season_fkey'
            columns: ['season']
            isOneToOne: false
            referencedRelation: 'Seasons'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Matches_season_fkey1'
            columns: ['season']
            isOneToOne: false
            referencedRelation: 'Seasons'
            referencedColumns: ['id']
          }
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
            foreignKeyName: 'MVPVotes_player_voted_season_fkey'
            columns: ['player_voted', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          },
          {
            foreignKeyName: 'MVPVotes_season_round_fkey'
            columns: ['season', 'round']
            isOneToOne: false
            referencedRelation: 'Matches'
            referencedColumns: ['season', 'round']
          },
          {
            foreignKeyName: 'MVPVotes_voter_season_fkey'
            columns: ['voter', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          }
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
            foreignKeyName: 'Players_season_fkey'
            columns: ['season']
            isOneToOne: false
            referencedRelation: 'Seasons'
            referencedColumns: ['id']
          }
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
            foreignKeyName: 'RedCards_player_season_fkey'
            columns: ['player', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          },
          {
            foreignKeyName: 'RedCards_season_round_fkey'
            columns: ['season', 'round']
            isOneToOne: false
            referencedRelation: 'Matches'
            referencedColumns: ['season', 'round']
          }
        ]
      }
      SavedPenalties: {
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
            foreignKeyName: 'SavedPenalties_player_season_fkey'
            columns: ['player', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          },
          {
            foreignKeyName: 'SavedPenalties_season_round_fkey'
            columns: ['season', 'round']
            isOneToOne: false
            referencedRelation: 'Matches'
            referencedColumns: ['season', 'round']
          }
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
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
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
            foreignKeyName: 'YellowCards_player_season_fkey'
            columns: ['player', 'season']
            isOneToOne: false
            referencedRelation: 'Players'
            referencedColumns: ['number', 'season']
          },
          {
            foreignKeyName: 'YellowCards_season_round_fkey'
            columns: ['season', 'round']
            isOneToOne: false
            referencedRelation: 'Matches'
            referencedColumns: ['season', 'round']
          }
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
