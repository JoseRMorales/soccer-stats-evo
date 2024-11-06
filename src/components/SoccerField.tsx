import { getPlayerStats, getStarters } from '@/app/actions'
import PlayerCard from '@/components/PlayerCard'
import lineups from '@/lib/lineups'
const positions = lineups['3-2-1']

const SoccerField = async ({
  season,
  round
}: {
  season: string
  round: number
}) => {
  const starters = await getStarters(season, round)

  const players = await Promise.all(
    starters.map(async (player) => {
      const playerStats = await getPlayerStats(season, player.player_number)

      return {
        ...player,
        starter: player.player_position !== -1,
        playerStats: {
          ...playerStats
        }
      }
    })
  )

  return (
    <div className="relative m-4">
      <img
        src="/field.svg"
        className="invert w-[600px]"
        alt="Soccer Field"
        // Mask image linear gradient
        style={{ maskImage: 'linear-gradient(to top, black 80%, transparent)' }}
      />

      {players.map((player) => {
        const index = player.player_position - 1
        const { x, y } = positions[index]
        return (
          <PlayerCard
            key={player.player_number}
            x={x}
            y={y}
            starter={player.starter}
            playerNumber={player.player_number}
            playerStats={player.playerStats}
          />
        )
      })}
    </div>
  )
}

export default SoccerField
