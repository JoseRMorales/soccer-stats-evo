import PlayerCardSkeleton from '@/components/skeletons/PlayerCardSkeleton'
import lineups from '@/lib/lineups'

const SoccerFieldSkeleton = () => {
  const positions = lineups['3-2-1']

  const players = positions.map((_, index) => ({
    player_number: index + 1,
    player_position: index + 1,
    starter: true
  }))

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
          <PlayerCardSkeleton
            key={player.player_number}
            x={x}
            y={y}
            starter={player.starter}
          />
        )
      })}
    </div>
  )
}

export default SoccerFieldSkeleton
