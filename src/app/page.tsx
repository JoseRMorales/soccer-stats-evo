import PlayerCard from '@/components/PlayerCard'
import SoccerField from '@/components/SoccerField'

export default function Home () {
  return (
    <div className="flex flex-col 2xl:flex-row justify-between 2xl:justify-center">
      {/* Game stats section */}
      <aside className="flex flex-col justify-center items-center 2:xlh-screen h:fit min-w-52 bg-blue-300">
        <p>Stats</p>
      </aside>
      {/* Lineup section */}
      <main className="flex flex-col 2xl:flex-row justify-between w-full 2xl:w-fit">
        {/* Starters section */}
        <section className="flex justify-center items-center 2xl:h-screen h-fit py-4 w-full 2xl:px-16">
          <SoccerField />
        </section>
        {/* Bench section */}
        <aside className="flex flex-row 2xl:flex-col items-center 2xl:h-screen 2xl:max-h-full h-fit  2xl:overflow-y-scroll 2xl:overflow-x-hidden overflow-x-auto overflow-y-auto">
          <PlayerCard starter={false} />
          <PlayerCard starter={false} />
          <PlayerCard starter={false} />
          <PlayerCard starter={false} />
          <PlayerCard starter={false} />
          <PlayerCard starter={false} />
          <PlayerCard starter={false} />
        </aside>
      </main>
    </div>
  )
}
