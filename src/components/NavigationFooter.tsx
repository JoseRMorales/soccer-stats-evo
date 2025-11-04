import Link from 'next/link'
import { getCurrentRound } from '@/app/actions'

const NavigationFooter = async () => {
  const { season } = await getCurrentRound()

  return (
    <footer className="w-full bg-muted py-8 border-t">
      <div className="container px-4 md:px-6 w-full mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Stats Column */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Stats</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href={`/season/${season}/top-goals`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Top Goals
              </Link>
              <Link
                href={`/season/${season}/top-assists`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Top Assists
              </Link>
              <Link
                href={`/season/${season}/top-goals-assists`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Top G/A
              </Link>
            </nav>
          </div>

          {/* Standings Column */}
          <div className="space-y-3">
            <nav className="flex flex-col space-y-2">
              <Link
                href={`/season/${season}/standings`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Standings
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default NavigationFooter
