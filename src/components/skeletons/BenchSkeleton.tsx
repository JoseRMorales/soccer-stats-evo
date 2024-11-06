import { Skeleton } from '@/components/ui/skeleton'

const BenchSkeleton = () => {
  return (
    <>
      {/* Widescreen */}
      <div className="hidden 2xl:flex flex-col items-center h-screen max-h-full w-60">
        <Skeleton className="w-48 h-96 my-16" />
      </div>
      {/* Mobile */}
      <div className="flex flex-row 2xl:hidden h-fit p-10">
        <Skeleton className="h-48 w-96 ml-6" />
      </div>
    </>
  )
}

export default BenchSkeleton
