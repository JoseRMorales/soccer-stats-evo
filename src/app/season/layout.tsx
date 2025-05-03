import NavigationFooter from '@/components/NavigationFooter'
import React from 'react'

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
