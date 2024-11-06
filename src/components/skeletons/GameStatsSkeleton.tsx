import { Skeleton } from '@/components/ui/skeleton'

const GameStatsSkeleton = () => {
  return (
    <div className="flex flex-col space-y-14 w-96 overflow-hidden items-center">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="flex flex-col space-y-6 items-center">
          <Skeleton className="w-80 h-7" />
          <Skeleton className="w-10 h-4" />
          <Skeleton className="w-80 h-7" />
        </h1>
        <br />
        <h2>
          <Skeleton className="w-20 h-7" />
        </h2>
      </div>
      <Skeleton className="w-36 h-36" />
    </div>
  )
}

export default GameStatsSkeleton
