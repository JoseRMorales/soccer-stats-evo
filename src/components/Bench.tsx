import { getBench, getPlayerStats } from '@/app/actions'
import PlayerCard from '@/components/PlayerCard'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const Bench = async ({ season, round }: { season: string; round: number }) => {
  const bench = await getBench(season, round)

  const players = await Promise.all(
    bench.map(async (player) => {
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
    <>
      {/* Widescreen */}
      <ScrollArea className="hidden 2xl:flex flex-col items-center h-screen max-h-full">
        {players.map((player) => (
          <PlayerCard
            key={player.player_number}
            playerNumber={player.player_number}
            starter={player.starter}
            playerStats={player.playerStats}
          />
        ))}
      </ScrollArea>
      {/* Mobile */}
      <ScrollArea className="">
        <div className="flex flex-row 2xl:hidden h-fit">
          {players.map((player) => (
            <PlayerCard
              key={player.player_number}
              playerNumber={player.player_number}
              starter={player.starter}
              playerStats={player.playerStats}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}

export default Bench
