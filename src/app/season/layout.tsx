import React from 'react'
import NavigationFooter from '@/components/NavigationFooter'

const SeasonLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      {children}
      <NavigationFooter />
    </>
  )
}

export default SeasonLayout
