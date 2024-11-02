import PlayerCard from '@/components/PlayerCard'
import lineups from '@/lib/lineups'
import React from 'react'

const positions = lineups['3-2-1']

const SoccerField = () => {
  return (
    <div className="relative m-4">
      <img
        src="/field.svg"
        className="invert w-[600px]"
        alt="Soccer Field"
        // Mask image linear gradient
        style={{ maskImage: 'linear-gradient(to top, black 80%, transparent)' }}
      />

      {positions.map((position, index) => (
        <PlayerCard key={index} x={position.x} y={position.y} />
      ))}
    </div>
  )
}

export default SoccerField
