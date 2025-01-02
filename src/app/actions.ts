'use server'

import {
  createClient,
  createDatabaseClient,
  createSessionClient,
} from '@/lib/appwrite/server'
import { APIError } from '@/lib/errors'
import { Database } from '@/types/database.types'
import { FormState, MatchStats, PlayerStats } from '@/types/types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppwriteException, Query } from 'node-appwrite'
import { z } from 'zod'

export const getCurrentRound = async () => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()

  const currentYearSeason = month > 6 ? year : year - 1

  // Get only the last two digits of the year
  const currentYearSeasonShort = Number(currentYearSeason.toString().slice(-2))
  const season = `${currentYearSeasonShort}-${currentYearSeasonShort + 1}`

  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Matches',
      [Query.equal('season', season)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const reversedMatches = data.documents.reverse() as Database['Matches'][]

  // Find the first match that has already been played
  const match = reversedMatches?.find((match) => {
    return match.played
  })

  const round = match?.round

  return {
    season,
    round,
  }
}

export const goToCurrentRound = async () => {
  const { season, round } = await getCurrentRound()

  redirect(`/season/${season}/round/${round}`)
}

export const getMatchTeams = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Teams',
      [Query.equal('owner', true), Query.limit(1)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const teams = data.documents as Database['Teams'][]
  const ownerTeam = teams[0].name

  let matchesData
  try {
    matchesData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Matches',
      [
        Query.equal('season', season),
        Query.equal('round', round),
        Query.limit(1),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const match = matchesData.documents[0] as Database['Matches']

  const opponentTeam = match.opponent.name
  const scoredGoals = match.goals_scored
  const concededGoals = match.goals_conceded

  return {
    ownerTeam,
    opponentTeam,
    scoredGoals,
    concededGoals,
  }
}

export const getMatchScorers = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data

  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Goals',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const goals = data.documents as Database['Goals'][]
  const scorers = await Promise.all(
    goals.map(async (goal) => {
      const playerInfo = await getPlayerInfo(season, goal.player)
      return {
        player: playerInfo.name,
        goals: goal.amount,
      }
    }),
  )

  return scorers
}

export const getMatchAssists = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data

  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Assists',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const assists = data.documents as Database['Assists'][]
  const assisters = await Promise.all(
    assists.map(async (assist) => {
      const playerInfo = await getPlayerInfo(season, assist.player)
      return {
        player: playerInfo.name,
        assists: assist.amount,
      }
    }),
  )

  return assisters
}

export const getMatchYellowCards = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data

  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'YellowCards',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const yellowCards = data.documents as Database['YellowCards'][]
  const yellowCardPlayers = await Promise.all(
    yellowCards.map(async (yellowCard) => {
      const playerInfo = await getPlayerInfo(season, yellowCard.player)
      return {
        player: playerInfo.name,
        yellowCards: yellowCard.amount,
      }
    }),
  )

  return yellowCardPlayers
}

export const getMatchRedCards = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data

  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'RedCards',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const redCards = data.documents as Database['RedCards'][]
  const redCardPlayers = await Promise.all(
    redCards.map(async (redCard) => {
      const playerInfo = await getPlayerInfo(season, redCard.player)
      return {
        player: playerInfo.name,
      }
    }),
  )

  return redCardPlayers
}

export const getPlayerInfo = async (season: string, playerNumber: number) => {
  const client = await createDatabaseClient()

  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Players',
      [
        Query.and([
          Query.equal('season', season),
          Query.equal('number', playerNumber),
        ]),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  return data.documents[0] as Database['Players']
}

export const getNextRound = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Matches',
      [
        Query.equal('season', season),
        Query.equal('round', round + 1),
        Query.limit(1),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  return data.documents[0]?.round
}

export const getPlayedMatches = async (
  season: string,
  playerNumber: number,
) => {
  const client = await createDatabaseClient()
  let playedMatchesData

  try {
    playedMatchesData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Lineups',
      [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }
  return playedMatchesData.documents.length
}

export const getGoalsNumber = async (season: string, playerNumber: number) => {
  const client = await createDatabaseClient()

  let totalGoalsData
  try {
    totalGoalsData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Goals',
      [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const totalGoals = totalGoalsData.documents.reduce(
    (acc, goal) => acc + goal.amount,
    0,
  )
  return totalGoals
}

export const getAssistsNumber = async (
  season: string,
  playerNumber: number,
) => {
  const client = await createDatabaseClient()

  let totalAssistsData
  try {
    totalAssistsData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Assists',
      [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const totalAssists = totalAssistsData.documents.reduce(
    (acc, assist) => acc + assist.amount,
    0,
  )

  return totalAssists
}

export const getYellowCardsNumber = async (
  season: string,
  playerNumber: number,
) => {
  const client = await createDatabaseClient()

  let totalYellowCardsData
  try {
    totalYellowCardsData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'YellowCards',
      [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const totalYellowCards = totalYellowCardsData.documents.reduce(
    (acc, yellowCard) => acc + yellowCard.amount,
    0,
  )

  return totalYellowCards
}

export const getRedCardsNumber = async (
  season: string,
  playerNumber: number,
) => {
  const client = await createDatabaseClient()

  let redCardsData
  try {
    redCardsData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'RedCards',
      [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const redCards = redCardsData.documents as Database['RedCards'][]

  return redCards.length
}

export const getPenaltiesSaved = async (
  season: string,
  playerNumber: number,
): Promise<[number, number]> => {
  const client = await createDatabaseClient()
  let totalPenaltiesSavedData
  try {
    totalPenaltiesSavedData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'PenaltiesAgainst',
      [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const totalPenaltiesSaved = totalPenaltiesSavedData.documents.reduce(
    (acc, penalty) => acc + penalty.amount,
    0,
  )

  const totalPenalties = totalPenaltiesSavedData.documents.reduce(
    (acc, penalty) => acc + penalty.total,
    0,
  )

  return [totalPenaltiesSaved, totalPenalties]
}

export const getPlayerStats = async (season: string, playerNumber: number) => {
  const playedMatches = await getPlayedMatches(season, playerNumber)

  const totalGoals = await getGoalsNumber(season, playerNumber)

  const totalAssists = await getAssistsNumber(season, playerNumber)

  const totalYellowCards = await getYellowCardsNumber(season, playerNumber)

  const totalRedCards = await getRedCardsNumber(season, playerNumber)

  const [totalPenaltiesSaved, totalPenalties] = await getPenaltiesSaved(
    season,
    playerNumber,
  )

  return {
    season,
    player_name: (await getPlayerInfo(season, playerNumber)).name,
    played_matches: playedMatches,
    total_goals: totalGoals,
    total_assists: totalAssists,
    total_penalties: totalPenalties,
    total_penalties_saved: totalPenaltiesSaved,
    total_red_cards: totalRedCards,
    total_yellow_cards: totalYellowCards,
  } as PlayerStats
}

export const getMatchStats = async (
  season: string,
  round: number,
): Promise<MatchStats> => {
  const client = await createDatabaseClient()
  let goalsData
  try {
    goalsData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Goals',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const goals = goalsData.documents as Database['Goals'][]
  const goalStats = goals.map(async (goal) => {
    const playerInfo = await getPlayerInfo(season, goal.player)
    return {
      player_name: playerInfo.name,
      player_number: goal.player,
      goals: goal.amount,
    }
  })

  let assistsData
  try {
    assistsData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Assists',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const assists = assistsData.documents as Database['Assists'][]
  const assistStats = assists.map(async (assist) => {
    const playerInfo = await getPlayerInfo(season, assist.player)
    return {
      player_name: playerInfo.name,
      player_number: assist.player,
      assists: assist.amount,
    }
  })

  let yellowCardsData
  try {
    yellowCardsData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'YellowCards',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const yellowCards = yellowCardsData.documents as Database['YellowCards'][]
  const yellowCardStats = yellowCards.map(async (yellowCard) => {
    const playerInfo = await getPlayerInfo(season, yellowCard.player)
    return {
      player_name: playerInfo.name,
      player_number: yellowCard.player,
      yellow_cards: yellowCard.amount,
    }
  })

  let redCardsData

  try {
    redCardsData = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'RedCards',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const redCards = redCardsData.documents as Database['RedCards'][]
  const redCardStats = redCards.map(async (redCard) => {
    const playerInfo = await getPlayerInfo(season, redCard.player)
    return {
      player_name: playerInfo.name,
      player_number: redCard.player,
    }
  })

  return {
    goals: await Promise.all(goalStats),
    assists: await Promise.all(assistStats),
    yellowCards: await Promise.all(yellowCardStats),
    redCards: await Promise.all(redCardStats),
  }
}

export const getStarters = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Lineups',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const lineupData = data.documents as Database['Lineups'][]
  const starters = lineupData.filter((player) => player.position !== -1)

  return starters
}

export const getBench = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Lineups',
      [Query.equal('season', season), Query.equal('round', round)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const lineupData = data.documents as Database['Lineups'][]
  const bench = lineupData.filter((player) => player.position === -1)

  return bench
}

export const getMatchDate = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data

  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Matches',
      [Query.and([Query.equal('season', season), Query.equal('round', round)])],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const match = data.documents[0] as Database['Matches']
  const datetime = match.datetime

  return new Date(datetime)
}

export const getPlayers = async (season: string) => {
  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Players',
      [Query.equal('season', season)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const players = data.documents as Database['Players'][]

  return players
}

export const isMatchPlayed = async (season: string, round: number) => {
  const client = await createDatabaseClient()

  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Matches',
      [Query.and([Query.equal('season', season), Query.equal('round', round)])],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const match = data.documents[0] as Database['Matches']

  return match.played
}

export const getStandings = async (season: string) => {
  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Standings',
      [Query.equal('season', season)],
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }
  const teams = data.documents as Database['Standings'][]

  const standings = teams
    .map((team) => {
      const points = team.won * 3 + team.drawn * 1
      return {
        ...team,
        points,
        name: team.team.name,
      }
    })
    .sort((a, b) => b.points - a.points)

  return standings
}

const LoginFormSchema = z.object({
  username: z.string().trim().nonempty(),
  password: z.string().nonempty(),
})

export async function login(_currentState: FormState, formData: FormData) {
  const appwrite = await createClient()

  const validateFields = LoginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }

  // Workaround, altogether with the backend email verification skip, to avoid the need of a real email. Only for local deployment with preset users.
  const data = {
    email: `${validateFields.data.username}@login.local`,
    password: validateFields.data.password,
  }

  try {
    const session = await appwrite.account.createEmailPasswordSession(
      data.email,
      data.password,
    )
    const cookiesData = await cookies()
    cookiesData.set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    })
  } catch (error) {
    if (error instanceof AppwriteException) {
      return {
        errors: {
          username: [error.message],
        },
      }
    } else {
      return {
        errors: {
          username: ['An unknown error occurred while logging in'],
        },
      }
    }
  }

  await goToCurrentRound()
}

export const logout = async () => {
  const { account } = await createSessionClient()
  const cookiesData = await cookies()
  cookiesData.delete('appwrite-session')

  await account.deleteSession('current')

  redirect('/login')
}
