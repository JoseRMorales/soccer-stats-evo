'use client'

import { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const SubmitButton = ({ children }: { children: ReactNode }) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <LoadingSpinner /> : children}
    </Button>
  )
}

export default SubmitButton
