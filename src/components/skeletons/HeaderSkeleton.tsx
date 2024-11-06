import { Skeleton } from '@/components/ui/skeleton'

const HeaderSkeleton = () => {
  return (
    <header className="w-full h-fit p-10 text-center flex justify-center items-center space-x-4">
      <Skeleton className="w-32 h-8" />
    </header>
  )
}

export default HeaderSkeleton
