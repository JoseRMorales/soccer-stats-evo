import { isMatchPlayed } from '@/app/actions'
import Bench from '@/components/Bench'
import GameStats from '@/components/GameStats'
import Header from '@/components/Header'
import LineupBuilderContainer from '@/components/LineupBuilderContainer'
import SoccerField from '@/components/SoccerField'
import BenchSkeleton from '@/components/skeletons/BenchSkeleton'
import GameStatsSkeleton from '@/components/skeletons/GameStatsSkeleton'
import HeaderSkeleton from '@/components/skeletons/HeaderSkeleton'
import SoccerFieldSkeleton from '@/components/skeletons/SoccerFieldSkeleton'
import { Suspense } from 'react'

const GamePage = async ({
  params,
}: {
  params: Promise<{ season: string; round: string }>
}) => {
  const { season, round } = await params
  const roundNumber = Number(round)

  const matchPlayed = await isMatchPlayed(season, roundNumber)

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header season={season} round={roundNumber} />
      </Suspense>
      <div className="flex flex-col 2xl:flex-row justify-center 2xl:justify-center">
        {/* Game stats section */}
        <aside className="flex flex-col justify-center items-center 2:xlh-screen h:fit min-w-5">
          <Suspense fallback={<GameStatsSkeleton />}>
            <GameStats season={season} round={roundNumber} />
          </Suspense>
        </aside>
        {/* Lineup section */}
        <main className="flex flex-col 2xl:flex-row justify-between w-full 2xl:w-fit">
          {matchPlayed ? (
            <>
              {/* Starters section */}
              <section className="flex justify-center items-center 2xl:h-screen h-fit py-4 w-full 2xl:px-16">
                <Suspense fallback={<SoccerFieldSkeleton />}>
                  <SoccerField season={season} round={roundNumber} />
                </Suspense>
              </section>
              {/* Bench section */}
              <aside>
                <Suspense fallback={<BenchSkeleton />}>
                  <Bench season={season} round={roundNumber} />
                </Suspense>
              </aside>
            </>
          ) : (
            <LineupBuilderContainer season={season} />
          )}
        </main>
      </div>
      <div />
    </div>
  )
}

export default GamePage

export const dynamic = 'force-static'
export const revalidate = 3600
