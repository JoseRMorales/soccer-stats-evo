import React from 'react'

import { getMatchDate, getMatchStats, getMatchTeams } from '@/app/actions'
import { APIError } from '@/lib/errors'
import {
  IconBallFootball,
  IconCardsFilled,
  IconShoe
} from '@tabler/icons-react'
import { redirect } from 'next/navigation'

const GameStats = async ({
  season,
  round
}: {
  season: string
  round: number
}) => {
  const { ownerTeam, opponentTeam, scoredGoals, concededGoals } =
    await getMatchTeams(season, Number(round)).catch((error: APIError) => {
      console.error(error)
      redirect('/404')
    })

  const matchStats = await getMatchStats(season, round)
  const matchDate = await getMatchDate(season, round)

  return (
    <div className="flex flex-col text-center space-y-6 w-96 overflow-hidden">
      <div className="text-4xl font-bold uppercase break-words">
        <h3 className="text-2xl pb-4">
          {matchDate?.toLocaleString('es-ES', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          })}
        </h3>
        <h1 className="flex flex-col">
          <span>{ownerTeam}</span>
          <span> - </span>
          <span>{opponentTeam}</span>
        </h1>
        <br />
        <h2>
          {scoredGoals && concededGoals && (
            <span>
              {scoredGoals} - {concededGoals}
            </span>
          )}
        </h2>
      </div>
      <dl className="grid grid-cols-[repeat(2,auto)] gap-x-6 w-max mb-12 mx-auto text-xl p-4">
        {matchStats.goals.map((goal) => (
          <React.Fragment key={goal.player_name}>
            <dt className="flex space-x-1">
              <IconBallFootball size={24} stroke={2} />
              {<span>{goal.goals > 1 ? `x${goal.goals}` : ''}</span>}
            </dt>
            <dd className="text-right">
              <span>{goal.player_name}</span>
            </dd>
          </React.Fragment>
        ))}
      </dl>
      <dl className="grid grid-cols-[repeat(2,auto)] gap-x-6 w-max mb-12 mx-auto text-xl p-4">
        {matchStats.assists.map((assist) => (
          <React.Fragment key={assist.player_name}>
            <dt className="flex space-x-1">
              <IconShoe size={24} stroke={2} />
              {<span>{assist.assists > 1 ? ` x${assist.assists}` : ''}</span>}
            </dt>
            <dd className="text-right">
              <span>{assist.player_name}</span>
            </dd>
          </React.Fragment>
        ))}
      </dl>
      <dl className="grid grid-cols-[repeat(2,auto)] gap-x-6 w-max mb-12 mx-auto text-xl p-4">
        {matchStats.yellowCards.map((yellowCard) => (
          <React.Fragment key={yellowCard.player_name}>
            <dt className="flex space-x-1">
              <IconCardsFilled size={24} stroke={2} color="yellow" />
              {
                <span>
                  {yellowCard.yellow_cards > 1
                    ? ` x${yellowCard.yellow_cards}`
                    : ''}
                </span>
              }
            </dt>
            <dd className="text-right">
              <span>{yellowCard.player_name}</span>
            </dd>
          </React.Fragment>
        ))}
      </dl>
      <dl className="grid grid-cols-[repeat(2,auto)] gap-x-6 w-max mb-12 mx-auto text-xl p-4">
        {matchStats.redCards.map((redCard) => (
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
