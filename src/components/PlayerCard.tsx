const PlayerCard = ({ x, y }: { x: number; y: number }) => {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer w-[80px] sm:w-[120px] card-clip"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Card Container */}
      <div className="relative w-full">
        {/* Clipping mask container */}
        <div className="relative aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
          {/* Top half - Avatar */}
          <div className="h-1/2 bg-gray-700 relative">
            <img
              src="/defaultAvatar.jpg"
              alt="Player Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom half - Stats */}
          <div className="h-1/2 flex flex-col bg-slate-700">
            {/* Player Name */}
            <div className="text-white font-bold text-sm truncate text-center">
              John Doe
            </div>

            {/* Stats Grid */}
            <div className="text-xs">
              {/* Goals */}
              <div className="p-1">Goals 12</div>

              {/* Assists */}
              <div className="p-1">Assists 2</div>

              {/* Games */}
              <div className="p-1">Games 10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
