import { getCurrentSeason, goToCurrentRound } from '@/app/actions'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { redirect } from 'next/navigation'

const SeasonPage = async ({
  params,
}: {
  params: Promise<{ season: string }>
}) => {
  const { season } = await params
  const currentSeason = await getCurrentSeason()

  if (season === currentSeason) {
    await goToCurrentRound()
  } else {
    redirect(`/season/${season}/round/1`)
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-4xl">Loading...</h1>
      <LoadingSpinner />
    </div>
  )
}

export default SeasonPage

export const dynamic = 'force-dynamic'
