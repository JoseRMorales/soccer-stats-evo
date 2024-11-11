import { Database } from '@/types/database.types'

export type PlayerStats =
  Database['public']['Functions']['get_player_stats']['Returns'][0]

export type MatchStat =
  Database['public']['Functions']['get_match_stats']['Returns'][0]

export type MatchStats = {
  goals: MatchStat[]
  assists: MatchStat[]
  yellowCards: MatchStat[]
  redCards: MatchStat[]
}

export type LineupBuilderPlayer = {
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
      message?: string
    }
  | undefined
