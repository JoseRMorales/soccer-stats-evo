import { getPlayerStats, getPlayers } from '@/app/actions'
import LineupBuilder from '@/components/LineupBuilder'

const LineupBuilderContainer = async ({ season }: { season: string }) => {
  const players = await getPlayers(season)

  const playerStats = await Promise.all(
    players.map(async (player, index) => {
      const playerStats = await getPlayerStats(season, player.number)

      const position = index < 7 ? index + 1 : -1

      if (!playerStats) {
        return {
          ...player,
          position,
          playerStats: {
            season,
            total_goals: 0,
            total_assists: 0,
            played_matches: 0,
            total_red_cards: 0,
            total_yellow_cards: 0,
            total_penalties_saved: 0,
            total_penalties: 0,
            player_name: player.name,
          },
        }
      }

      return {
        ...player,
        position,
        playerStats: {
          ...playerStats,
        },
      }
    }),
  )

  return <LineupBuilder players={playerStats} />
}

export default LineupBuilderContainer
