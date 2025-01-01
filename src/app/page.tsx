import { goToCurrentRound } from '@/app/actions'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const HomePage = async () => {
  await goToCurrentRound()

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-4xl">Loading...</h1>
      <LoadingSpinner />
    </div>
  )
}

export default HomePage

export const dynamic = 'force-dynamic'
