import {
  getMatchLineup,
  getMatchStats,
  getMatchTeams,
  getPlayerStats
} from '@/app/actions'
import GameStats from '@/components/GameStats'
import Header from '@/components/Header'
import PlayerCard from '@/components/PlayerCard'
import SoccerField from '@/components/SoccerField'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { APIError } from '@/lib/errors'
import { redirect } from 'next/navigation'

const GamePage = async ({
  params
}: {
  params: Promise<{ season: string; round: string }>
}) => {
  const { season, round } = await params
  const roundNumber = Number(round)
  const { ownerTeam, opponentTeam, scoredGoals, concededGoals } =
    await getMatchTeams(season, Number(round)).catch((error: APIError) => {
      console.error(error)
      redirect('/404')
    })

  const matchStats = await getMatchStats(season, roundNumber)

  const lineup = await getMatchLineup(season, roundNumber)

  const players = await Promise.all(
    lineup.map(async (player) => {
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

  const starters = players.filter((player) => player.starter)
  const bench = players.filter((player) => !player.starter)

  return (
    <div className="flex flex-col min-h-screen">
      <Header season={season} round={roundNumber} />
      <div className="flex flex-col 2xl:flex-row justify-center 2xl:justify-center">
        {/* Game stats section */}
        <aside className="flex flex-col justify-center items-center 2:xlh-screen h:fit min-w-5">
          <GameStats
            ownerTeam={ownerTeam}
            opponentTeam={opponentTeam}
            scoredGoals={scoredGoals}
            concededGoals={concededGoals}
            matchStats={matchStats}
          />
        </aside>
        {/* Lineup section */}
        <main className="flex flex-col 2xl:flex-row justify-between w-full 2xl:w-fit">
          {/* Starters section */}
          <section className="flex justify-center items-center 2xl:h-screen h-fit py-4 w-full 2xl:px-16">
            <SoccerField starters={starters} />
          </section>
          {/* Bench section */}
          <aside className="">
            {/* Widescreen */}
            <ScrollArea className="hidden 2xl:flex flex-col items-center h-screen max-h-full">
              {bench.map((player) => (
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
                {bench.map((player) => (
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
          </aside>
        </main>
      </div>
      <div />
    </div>
  )
}

export default GamePage
