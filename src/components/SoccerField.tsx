import PlayerCard from '@/components/PlayerCard'
import React from 'react'

const oneTwoThreeOneLineUp = [
  { x: 50, y: 75 }, // GK
  { x: 35, y: 65 }, // Left Defender
  { x: 65, y: 65 }, // Right Defender
  { x: 25, y: 50 }, // Left Mid
  { x: 50, y: 55 }, // Center Mid
  { x: 75, y: 50 }, // Right Mid
  { x: 50, y: 40 } // Forward
]

const oneOneOneThreOneOneLineUp = [
  { x: 50, y: 95 }, // GK
  { x: 50, y: 75 }, // Center Defender
  { x: 25, y: 55 }, // Left Mid
  { x: 50, y: 55 }, // Center Mid
  { x: 75, y: 55 }, // Right Mid
  { x: 50, y: 35 }, // Advanced Mid
  { x: 50, y: 15 } // Forward
]

const oneThreeTwoOneLineUp = [
  { x: 50, y: 90 }, // GK
  { x: 25, y: 65 }, // Left Defender
  { x: 50, y: 65 }, // Center Defender
  { x: 75, y: 65 }, // Right Defender
  { x: 35, y: 40 }, // Left Mid
  { x: 65, y: 40 }, // Right Mid
  { x: 50, y: 15 } // Forward
]

const positions = oneThreeTwoOneLineUp

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
