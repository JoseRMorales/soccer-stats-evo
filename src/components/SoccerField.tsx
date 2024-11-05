import PlayerCard from '@/components/PlayerCard'
import lineups from '@/lib/lineups'
import { PlayerCardInfo } from '@/types/types'
const positions = lineups['3-2-1']

interface Starters {
  player_number: number
  player_position: number
  starter: boolean
  playerCardInfo: PlayerCardInfo
}

const SoccerField = ({ starters }: { starters: Starters[] }) => {
  return (
    <div className="relative m-4">
      <img
        src="/field.svg"
        className="invert w-[600px]"
        alt="Soccer Field"
        // Mask image linear gradient
        style={{ maskImage: 'linear-gradient(to top, black 80%, transparent)' }}
      />

      {starters.map((player) => {
        const index = player.player_position - 1
        const { x, y } = positions[index]
        return (
          <PlayerCard
            key={player.player_number}
            x={x}
            y={y}
            starter={player.starter}
            playerCardInfo={player.playerCardInfo}
          />
        )
      })}
    </div>
  )
}

export default SoccerField
