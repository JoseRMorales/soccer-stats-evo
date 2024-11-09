'use client'
import PlayerCardBuilder from '@/components/PlayerCardBuilder'
import lineups from '@/lib/lineups'
import { LineupBuilderPlayer } from '@/types/types'
import { useEffect } from 'react'
import { createSwapy } from 'swapy'

const LineupBuilder = ({ players }: { players: LineupBuilderPlayer[] }) => {
  useEffect(() => {
    const container = document.querySelector('.swapy-container')

    const swapy = createSwapy(container, {
      animation: 'spring'
    })

    swapy.enable(true)
  }, [])

  const positions = lineups['3-2-1']

  return (
    <div className="swapy-container flex flex-col 2xl:flex-row justify-between w-full 2xl:w-fit">
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
                  playerNumber={player.number}
                  playerStats={player.playerStats}
                />
              )
            })}
        </div>
      </section>
      {/* Bench section */}
      <aside className="">
        {/* Widescreen */}
        <div className="hidden 2xl:flex flex-col flex-wrap items-center h-screen max-h-full">
          {players
            .filter((player) => player.position === -1)
            .map((player, index) => (
              <PlayerCardBuilder
                x={0}
                y={index}
                key={player.number}
                playerNumber={player.number}
                playerStats={player.playerStats}
                starter={false}
              />
            ))}
        </div>
        {/* Mobile */}
        <div className="flex flex-row flex-wrap 2xl:hidden h-fit w-full">
          {players
            .filter((player) => player.position === -1)
            .map((player, index) => (
              <PlayerCardBuilder
                x={1}
                y={index}
                key={player.number}
                playerNumber={player.number}
                playerStats={player.playerStats}
                starter={false}
              />
            ))}
        </div>
      </aside>
    </div>
  )
}

export default LineupBuilder
