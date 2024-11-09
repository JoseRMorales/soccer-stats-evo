import { getPlayers, getPlayerStats } from '@/app/actions'
import LineupBuilder from '@/components/LineupBuilder'

const LineupBuilderContainer = async ({ season }: { season: string }) => {
  const players = await getPlayers(season)

  const playerStats = await Promise.all(
    players.map(async (player, index) => {
      const playerStats = await getPlayerStats(season, player.number)

      const position = index < 7 ? index + 1 : -1

      return {
        ...player,
        position,
        playerStats: {
          ...playerStats
        }
      }
    })
  )

  return <LineupBuilder players={playerStats} />
}

export default LineupBuilderContainer
