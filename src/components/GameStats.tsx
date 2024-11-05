import React from 'react'

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
    <div className="flex flex-col text-center space-y-6 max-w-md overflow-hidden">
      <div className="text-4xl font-bold uppercase break-words">
        <h1 className="flex flex-col">
          <span>{ownerTeam}</span>
          <span> - </span>
          <span>{opponentTeam}</span>
        </h1>
        <br />
        <h2>
          {scoredGoals} - {concededGoals}
        </h2>
      </div>
      <dl className="grid grid-cols-[repeat(2,auto)] gap-x-6 w-max mb-12 mx-auto text-xl p-4">
        {scorers.map((scorer) => (
          <React.Fragment key={scorer.player_name}>
            <dt>
              <IconBallFootball size={24} stroke={2} />
            </dt>
            <dd className="text-right">
              <span>{scorer.player_name}</span>
              {
                <span>
                  {scorer.goals_amount > 1 ? `x${scorer.goals_amount}` : ''}
                </span>
              }
            </dd>
          </React.Fragment>
        ))}
      </dl>
      <dl className="grid grid-cols-[repeat(2,auto)] gap-x-6 w-max mb-12 mx-auto text-xl">
        {assists.map((assist) => (
          <React.Fragment key={assist.player_name}>
            <dt>
              <IconShoe size={24} stroke={2} />
            </dt>
            <dd className="text-right">{assist.player_name}</dd>
          </React.Fragment>
        ))}
      </dl>
      <dl className="grid grid-cols-[repeat(2,auto)] gap-x-6 w-max mb-12 mx-auto text-xl">
        {yellowCards.map((yellowCard) => (
          <React.Fragment key={yellowCard.player_name}>
            <dt>
              <IconCardsFilled size={24} stroke={2} color="yellow" />
            </dt>
            <dd className="text-right">{yellowCard.player_name}</dd>
          </React.Fragment>
        ))}
      </dl>
      <dl className="grid grid-cols-[repeat(2,auto)] gap-x-6 w-max mb-12 mx-auto text-xl">
        {redCards.map((redCard) => (
          <React.Fragment key={redCard.player_name}>
            <dt>
              <IconCardsFilled size={24} stroke={2} color="red" />
            </dt>
            <dd className="text-right">{redCard.player_name}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  )
}

export default GameStats
