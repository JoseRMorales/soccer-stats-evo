'use client'
import PlayerCardBuilder from '@/components/PlayerCardBuilder'
import lineups from '@/lib/lineups'
import { LineupBuilderPlayer } from '@/types/types'

const LineupBuilder = ({ players }: { players: LineupBuilderPlayer[] }) => {
  const positions = lineups['3-2-1']

  return (
    <div className="flex flex-col 2xl:flex-row justify-between w-full 2xl:w-fit">
      {/* Starters section */}
      <section className="flex justify-center items-center 2xl:h-screen h-fit py-4 w-full 2xl:px-16">
        <div className="relative m-4">
          <img
            src="/field.svg"
            className="invert w-[600px]"
            alt="Soccer Field"
            // Mask image linear gradient
            style={{
              maskImage: 'linear-gradient(to top, black 80%, transparent)'
            }}
          />

          {players
            .filter((player) => player.position !== -1)
            .map((player) => {
              const index = player.position - 1
              const { x, y } = positions[index]
              return (
                <PlayerCardBuilder
                  key={player.number}
                  x={x}
                  y={y}
                  player={player}
                  players={players}
                />
              )
            })}
        </div>
      </section>
    </div>
  )
}

export default LineupBuilder
