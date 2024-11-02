import GameStats from '@/components/GameStats'
import PlayerCard from '@/components/PlayerCard'
import SoccerField from '@/components/SoccerField'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
export default function Home () {
  return (
    <div className="flex flex-col 2xl:flex-row justify-between 2xl:justify-center">
      {/* Game stats section */}
      <aside className="flex flex-col justify-center items-center 2:xlh-screen h:fit min-w-5">
        <GameStats />
      </aside>
      {/* Lineup section */}
      <main className="flex flex-col 2xl:flex-row justify-between w-full 2xl:w-fit">
        {/* Starters section */}
        <section className="flex justify-center items-center 2xl:h-screen h-fit py-4 w-full 2xl:px-16">
          <SoccerField />
        </section>
        {/* Bench section */}
        <aside className="">
          <ScrollArea className="hidden 2xl:flex flex-col items-center h-screen max-h-full">
            <PlayerCard starter={false} />
            <PlayerCard starter={false} />
            <PlayerCard starter={false} />
            <PlayerCard starter={false} />
            <PlayerCard starter={false} />
            <PlayerCard starter={false} />
            <PlayerCard starter={false} />
          </ScrollArea>
          <ScrollArea className="">
            <div className="flex flex-row 2xl:hidden h-fit">
              <PlayerCard starter={false} />
              <PlayerCard starter={false} />
              <PlayerCard starter={false} />
              <PlayerCard starter={false} />
              <PlayerCard starter={false} />
              <PlayerCard starter={false} />
              <PlayerCard starter={false} />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </aside>
      </main>
    </div>
  )
}
