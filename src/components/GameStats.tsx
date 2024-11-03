const GameStats = ({
  ownerTeam,
  opponentTeam
}: {
  ownerTeam: string
  opponentTeam: string
}) => {
  return (
    <div className="flex flex-col text-center space-y-6">
      <div className="text-4xl font-bold uppercase">
        {
          <h1>
            {ownerTeam} - {opponentTeam}
          </h1>
        }
        <br />
        <h2>3 - 0</h2>
      </div>
      <div className="flex flex-col text-center text-xl">
        <h3>Goals</h3>
        <ul>
          <li>John</li>
          <li>Doe</li>
        </ul>
      </div>
      <div>
        <h3>Assists</h3>
        <ul>
          <li>John</li>
          <li>Doe</li>
        </ul>
      </div>
      <div>
        <h3>Yellow Cards</h3>
        <ul>
          <li>John</li>
          <li>Doe</li>
        </ul>
      </div>
    </div>
  )
}

export default GameStats
