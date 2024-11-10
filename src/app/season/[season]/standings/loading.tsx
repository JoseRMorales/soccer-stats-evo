import { LoadingSpinner } from '@/components/ui/loading-spinner'

const loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoadingSpinner size={90} />
    </div>
  )
}

export default loading

export const dynamic = 'force-static'
export const revalidate = 3600
