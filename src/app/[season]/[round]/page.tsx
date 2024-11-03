import {
  getMatchAssists,
  getMatchLineup,
  getMatchRedCards,
  getMatchScorers,
  getMatchTeams,
  getMatchYellowCards,
  getPlayerInfo
} from '@/app/actions'
import GameStats from '@/components/GameStats'
import PlayerCard from '@/components/PlayerCard'
import SoccerField from '@/components/SoccerField'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const GamePage = async ({
  params
}: {
  params: Promise<{ season: string; round: string }>
}) => {
  const { season, round } = await params
  const { ownerTeam, opponentTeam, scoredGoals, concededGoals } =
    await getMatchTeams(season, Number(round))
  const scorers = await getMatchScorers(season, Number(round))
  const assists = await getMatchAssists(season, Number(round))
  const yellowCards = await getMatchYellowCards(season, Number(round))
  const redCards = await getMatchRedCards(season, Number(round))
  const lineup = await getMatchLineup(season, Number(round))

  const players = await Promise.all(
    lineup.map(async (player) => {
      const playerInfo = await getPlayerInfo(season, player.player_number)
      return {
        ...player,
        starter: player.player_position !== -1,
        playerCardInfo: {
          ...playerInfo,
          number: player.player_number
        }
      }
    })
  )

  const starters = players.filter((player) => player.starter)
  const bench = players.filter((player) => !player.starter)

  return (
    <div className="flex flex-col 2xl:flex-row justify-between 2xl:justify-center">
      {/* Game stats section */}
      <aside className="flex flex-col justify-center items-center 2:xlh-screen h:fit min-w-5">
        <GameStats
          ownerTeam={ownerTeam}
          opponentTeam={opponentTeam}
          scoredGoals={scoredGoals}
          concededGoals={concededGoals}
          scorers={scorers}
          assists={assists}
          yellowCards={yellowCards}
          redCards={redCards}
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
                starter={player.starter}
                playerCardInfo={player.playerCardInfo}
              />
            ))}
          </ScrollArea>
          {/* Mobile */}
          <ScrollArea className="">
            <div className="flex flex-row 2xl:hidden h-fit">
              {bench.map((player) => (
                <PlayerCard
                  key={player.player_number}
                  starter={player.starter}
                  playerCardInfo={player.playerCardInfo}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </aside>
      </main>
    </div>
  )
}

export default GamePage
