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
