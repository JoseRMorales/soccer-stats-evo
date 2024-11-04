import { getNextRound } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const Header = async ({ season, round }: { season: string; round: number }) => {
  const previousRound = round > 1 ? round - 1 : null
  const nextRound = await getNextRound(season, round)

  return (
    <header className="w-full h-fit p-10 text-center flex justify-center items-center space-x-4">
      {previousRound
        ? (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${season}/${previousRound}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
          )
        : (
        <Button variant="ghost" size="icon" className="invisible">
          <ChevronLeft className="h-4 w-4" />
        </Button>
          )}

      <h1 className="text-2xl min-w-32">Round {round}</h1>

      {nextRound
        ? (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${season}/${nextRound}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
          )
        : (
        <Button variant="ghost" size="icon" className="invisible">
          <ChevronRight className="h-4 w-4" />
        </Button>
          )}
    </header>
  )
}

export default Header
