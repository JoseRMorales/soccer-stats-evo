import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { PlayerStats } from '@/types/types'

const PlayerCard = async ({
  x = 0,
  y = 0,
  starter = true,
  playerNumber,
  playerStats
}: {
  x?: number
  y?: number
  starter?: boolean
  playerNumber: number
  playerStats: PlayerStats
}) => {
  const backgroundImage = '/defaultAvatar.png'

  const styleObject = starter
    ? {
        left: `${x}%`,
        top: `${y}%`,
        transformOrigin: 'center'
      }
    : {}

  const commonClasses =
    'cursor-pointer transition-transform duration-300 ease-in-out'

  const classes = starter
    ? `absolute transform translate-x-[-50%] translate-y-[-50%] ${commonClasses} scale-[30%] sm:scale-50 hover:scale-[35%] sm:hover:scale-[55%]`
    : `${commonClasses} scale-[50%] sm:scale-[70%] hover:scale-[55%] sm:hover:scale-[75%]`

  return (
    <div className={classes} style={styleObject}>
      <Dialog>
        <DialogTrigger>
          <div id="card" className="active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 430">
              <clipPath id="svgPath">
                <path
                  fill="#000"
                  d="M265.3 53.9a33.3 33.3 0 0 1-17.8-5.5 32 32 0 0 1-13.7-22.9c-.2-1.1-.4-2.3-.4-3.4 0-1.3-1-1.5-1.8-1.9a163 163 0 0 0-31-11.6A257.3 257.3 0 0 0 133.7 0a254.9 254.9 0 0 0-67.1 8.7 170 170 0 0 0-31 11.6c-.8.4-1.8.6-1.8 1.9 0 1.1-.2 2.3-.4 3.4a32.4 32.4 0 0 1-13.7 22.9A33.8 33.8 0 0 1 2 53.9c-1.5.1-2.1.4-2 2v293.9c0 3.3 0 6.6.4 9.9a22 22 0 0 0 7.9 14.4c3.8 3.2 8.3 5.3 13 6.8 12.4 3.9 24.8 7.5 37.2 11.5a388.7 388.7 0 0 1 50 19.4 88.7 88.7 0 0 1 25 15.5v.1-.1c7.2-7 16.1-11.3 25-15.5a427 427 0 0 1 50-19.4l37.2-11.5c4.7-1.5 9.1-3.5 13-6.8 4.5-3.8 7.2-8.5 7.9-14.4.4-3.3.4-6.6.4-9.9V231.6 60.5v-4.6c.4-1.6-.3-1.9-1.7-2z"
                />
              </clipPath>
            </svg>
            <div id="card-inner">
              <div id="card-top">
                <div
                  className="image"
                  style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
              </div>
              <div id="card-bottom">
                <div className="name">
                  {playerNumber} - {playerStats.player_name}
                </div>
                <dl className="stats grid grid-cols-[repeat(2,auto)] gap-x-2 w-max mb-12 mx-auto text-4xl uppercase">
                  <dt>games</dt>
                  <dd className="text-right">{playerStats.played_matches}</dd>
                  <dt>goals</dt>
                  <dd className="text-right">{playerStats.total_goals}</dd>
                  <dt>assists</dt>
                  <dd className="text-right">{playerStats.total_assists}</dd>
                </dl>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="border-primary">
          <DialogHeader>
            <DialogTitle>Player Info</DialogTitle>
            <div className="flex justify-between text-xl items-center text-foreground">
              <img
                src={backgroundImage}
                alt="Player"
                className="w-20 h-20 rounded-full"
              />
              <span className="text-3xl">{playerNumber}</span>
              <span>{playerStats.player_name}</span>
            </div>
          </DialogHeader>
          <DialogHeader>
            <DialogTitle>Player Stats</DialogTitle>
          </DialogHeader>
          <div className="text-md">
            <dl className="grid grid-cols-[repeat(2,auto)] gap-x-2 w-full">
              <dt>Games</dt>
              <dd className="text-right font-bold text-foreground">
                {playerStats.played_matches}
              </dd>
              <dt>Goals</dt>
              <dd className="text-right font-bold text-foreground">
                {playerStats.total_goals}
              </dd>
              <dt>Assists</dt>
              <dd className="text-right font-bold text-foreground">
                {playerStats.total_assists}
              </dd>
              <dt>Yellow Cards</dt>
              <dd className="text-right font-bold text-foreground">
                {playerStats.total_yellow_cards}
              </dd>
              <dt>Red Cards</dt>
              <dd className="text-right font-bold text-foreground">
                {playerStats.total_red_cards}
              </dd>
              <dt>Saved Penalties</dt>
              <dd className="text-right font-bold text-foreground">
                {playerStats.total_penalties_saved}/
                {playerStats.total_penalties}
              </dd>
            </dl>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlayerCard
