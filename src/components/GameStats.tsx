import { Database } from '@/types/database.types'
import {
  IconBallFootball,
  IconCardsFilled,
  IconShoe
} from '@tabler/icons-react'

type scorersResponse =
  Database['public']['Functions']['get_match_scorers']['Returns']
type assistsResponse =
  Database['public']['Functions']['get_match_assists']['Returns']
type yellowCardsResponse =
  Database['public']['Functions']['get_match_yellow_cards']['Returns']
type redCardsResponse =
  Database['public']['Functions']['get_match_red_cards']['Returns']

const GameStats = ({
  ownerTeam,
  opponentTeam,
  scoredGoals,
  concededGoals,
  scorers,
  assists,
  yellowCards,
  redCards
}: {
  ownerTeam: string
  opponentTeam: string
  scoredGoals: number | null
  concededGoals: number | null
  scorers: scorersResponse
  assists: assistsResponse
  yellowCards: yellowCardsResponse
  redCards: redCardsResponse
}) => {
  return (
    <div className="flex flex-col text-center space-y-6">
      <div className="text-4xl font-bold uppercase">
        <h1>
          {ownerTeam} - {opponentTeam}
        </h1>
        <br />
        <h2>
          {scoredGoals} - {concededGoals}
        </h2>
      </div>
      <div className="flex flex-col text-center text-xl">
        {scorers.map((scorer) => (
          <div
            key={scorer.player_name}
            className="flex items-center justify-center space-x-2"
          >
            <IconBallFootball size={24} stroke={2} />
            <span>{scorer.player_name}</span>
            {
              <span>
                {scorer.goals_amount > 1 ? `x${scorer.goals_amount}` : ''}
              </span>
            }
          </div>
        ))}
      </div>
      <div className="flex flex-col text-center text-xl">
        {assists.map((assist) => (
          <div
            key={assist.player_name}
            className="flex items-center justify-center space-x-2"
          >
            <IconShoe size={24} stroke={2} />
            <span>{assist.player_name}</span>
            {
              <span>
                {assist.assists_amount > 1 ? `x${assist.assists_amount}` : ''}
              </span>
            }
          </div>
        ))}
      </div>
      <div className="flex flex-col text-center text-xl">
        {yellowCards.map((yellowCard) => (
          <div
            key={yellowCard.player_name}
            className="flex items-center justify-center space-x-2"
          >
            <IconCardsFilled size={24} stroke={2} color="yellow" />
            <span>{yellowCard.player_name}</span>
            <span>
              {yellowCard.cards_amount > 1 ? `x${yellowCard.cards_amount}` : ''}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col text-center text-xl">
        {redCards.map((redCard) => (
          <div
            key={redCard.player_name}
            className="flex items-center justify-center space-x-2"
          >
            <IconCardsFilled size={24} stroke={2} color="red" />
            <span>{redCard.player_name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameStats
