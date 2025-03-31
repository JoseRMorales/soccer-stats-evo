export interface PlayerStats {
  season: string
  player_name: string
  played_matches: number
  total_goals: number
  total_assists: number
  total_penalties: number
  total_penalties_saved: number
  total_red_cards: number
  total_yellow_cards: number
}

export interface MatchStat {
  player_name: string
  player_number: number
  goals?: number
  assists?: number
  yellow_cards?: number
  red_cards?: number
}

export interface MatchStats {
  goals: MatchStat[]
  assists: MatchStat[]
  yellowCards: MatchStat[]
  redCards: MatchStat[]
}

export interface LineupBuilderPlayer {
  name: string
  number: number
  position: number
  playerStats: PlayerStats
}

export type FormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
      }
    }
  | undefined

export type MatchFormState =
  | {
      errors?: {
        season?: string[]
        round?: string[]
        dateTime?: string[]
        opponent?: string[]
      }
    }
  | {
      successMessage?: string[]
    }
  | undefined

export type MatchResultsState =
  | {
      errors?: {
        season?: string[]
        round?: string[]
        scored?: string[]
        received?: string[]
        starters?: string[]
        bench?: string[]
        goals?: string[]
        assists?: string[]
      }
    }
  | {
      successMessage?: string[]
    }
  | undefined

export type StandingsEditorState =
  | {
      errors?: {
        season?: string[]
        standings?: string[]
      }
    }
  | {
      successMessage?: string[]
    }
  | undefined
