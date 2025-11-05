import Link from 'next/link'
import { getCurrentRound, getStandings } from '@/app/actions'
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

const Standings = async ({
  params,
}: {
  params: Promise<{ season: string }>
}) => {
  const { season } = await params
  const standings = await getStandings(season)
  const { round } = await getCurrentRound()

  return (
    <>
      <Button variant="outline" asChild className="text-xl m-10">
        <Link href={`/season/${season}/round/${round}`}>Current round</Link>
      </Button>
      <main className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-4xl pb-10">Standings</h1>
        {standings?.length === 0 ? (
          <h2 className="text-2xl">No standings available</h2>
        ) : (
          <Table className="w-full max-w-3xl mx-auto text-md md:text-xl">
            <TableCaption>Standings</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Team</TableHead>
                <TableHead className="text-right sm:pl-32">W</TableHead>
                <TableHead className="text-right">D</TableHead>
                <TableHead className="text-right">L</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((team) => (
                <TableRow key={team.name}>
                  <TableCell className="text-right font-bold">
                    {team.name}
                  </TableCell>
                  <TableCell className="text-right">{team.won}</TableCell>
                  <TableCell className="text-right">{team.drawn}</TableCell>
                  <TableCell className="text-right">{team.lost}</TableCell>
                  <TableCell className="text-right">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </>
  )
}

export default Standings

export const dynamic = 'force-static'
export const revalidate = 3600
