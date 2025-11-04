import Link from 'next/link'
import { getCurrentRound, getTopGoals } from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const TopGoals = async ({
  params,
}: {
  params: Promise<{ season: string }>
}) => {
  const { season } = await params
  const assists = await getTopGoals(season)
  const { round } = await getCurrentRound()

  return (
    <>
      <Button variant="outline" asChild className="text-xl m-10">
        <Link href={`/season/${season}/round/${round}`}>Current round</Link>
      </Button>
      <main className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-4xl pb-10">Top Goals</h1>
        <Table className="w-full max-w-3xl mx-auto text-md md:text-xl">
          <TableCaption>Top Assists</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Player</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assists.map((player) => (
              <TableRow key={player.player_name}>
                <TableCell className="text-right font-bold">
                  {player.player_name}
                </TableCell>
                <TableCell className="text-right">{player.goals}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </>
  )
}

export default TopGoals
