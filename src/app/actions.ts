'use server'

import {
  createClient,
  createDatabaseClient,
  createDatabaseClientWithSession,
  createSessionClient,
} from '@/lib/appwrite/server'
import { APIError } from '@/lib/errors'
import { Database } from '@/types/database.types'
import {
  FormState,
  MatchFormState,
  MatchResultsState,
  MatchStats,
  PlayerStats,
  StandingsEditorState,
} from '@/types/types'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { AppwriteException, ID, Query, Users } from 'node-appwrite'
import { z } from 'zod'

export const getCurrentSeason = async () => {
  const client = await createDatabaseClient()

  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Seasons',
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const seasons = data.documents as Database['Seasons'][]
  const orderedSeasons = seasons.sort((a, b) => b.order - a.order)

  return orderedSeasons[0].id
}

export const getCurrentRound = async () => {
  const season = await getCurrentSeason()

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
    const sessionExpìres = new Date(session.expire)
    const cookiesData = await cookies()
    cookiesData.set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      expires: sessionExpìres,
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

export const getSeasons = async () => {
  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Seasons',
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const seasons = data.documents as Database['Seasons'][]

  return seasons
}

export const getTeams = async () => {
  const client = await createDatabaseClient()
  let data
  try {
    data = await client.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Teams',
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const teams = data.documents as Database['Teams'][]

  return teams
}

const createMatchSchema = z.object({
  season: z.string().nonempty(),
  round: z.number().int().gte(1),
  dateTime: z.string().nonempty(),
  opponent: z.string().nonempty(),
})

export const createMatch = async (
  _currentState: MatchFormState,
  formData: FormData,
) => {
  const validateFields = createMatchSchema.safeParse({
    season: formData.get('season'),
    round: Number(formData.get('round')),
    dateTime: formData.get('dateTime'),
    opponent: formData.get('opponent'),
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }

  try {
    const session = await createDatabaseClientWithSession()
    await session.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      'Matches',
      ID.unique(),
      {
        season: validateFields.data.season,
        round: validateFields.data.round,
        datetime: validateFields.data.dateTime,
        opponent: validateFields.data.opponent,
        played: false,
      },
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      return {
        errors: {
          season: [error.message],
        },
      }
    } else {
      return {
        errors: {
          season: ['An unknown error occurred while creating the match'],
        },
      }
    }
  }

  return {
    successMessage: ['Match created successfully'],
  }
}

const matchResultSchema = z.object({
  season: z.string().nonempty(),
  round: z.number().int().gte(1),
  scored: z.number().int().gte(0),
  received: z.number().int().gte(0),
  starters: z.array(z.number().int()).length(7),
  bench: z.array(z.number().int()),
  goals: z.array(
    z.object({
      player: z.number().int(),
      amount: z.number().int().positive().gte(1),
      type: z.union([
        z.literal('InGame'),
        z.literal('Penalty'),
        z.literal('FreeKick'),
      ]),
    }),
  ),
  assists: z.array(
    z.object({
      player: z.number().int(),
      amount: z.number().int().positive().gte(1),
    }),
  ),
  yellowCards: z.array(
    z.object({
      player: z.number().int(),
      amount: z.number().int().positive().gte(1),
    }),
  ),
  redCards: z.array(z.number().int()),
})

export const addMatchResults = async (
  _currentState: MatchResultsState,
  formData: FormData,
) => {
  const validateFields = matchResultSchema.safeParse({
    season: formData.get('season'),
    round: Number(formData.get('round')),
    scored: Number(formData.get('scored')),
    received: Number(formData.get('received')),
    starters: JSON.parse((formData.get('starters') as string) || '[]'),
    bench: JSON.parse((formData.get('bench') as string) || '[]'),
    goals: JSON.parse((formData.get('goals') as string) || '[]'),
    assists: JSON.parse((formData.get('assists') as string) || '[]'),
    yellowCards: JSON.parse((formData.get('yellowCards') as string) || '[]'),
    redCards: JSON.parse((formData.getAll('redCards') as string[]).join(',')),
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }

  try {
    const session = await createDatabaseClientWithSession()

    // Update match
    const matchDocument = await session.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Matches',
      [
        Query.and([
          Query.equal('season', validateFields.data.season),
          Query.equal('round', validateFields.data.round),
        ]),
      ],
    )

    const match = matchDocument.documents[0] as Database['Matches']
    await session.updateDocument(
      process.env.APPWRITE_DATABASE_ID!,
      'Matches',
      match.$id,
      {
        goals_scored: validateFields.data.scored,
        goals_conceded: validateFields.data.received,
        played: true,
      },
    )

    // Add lineup
    const starters = validateFields.data.starters
    await Promise.all(
      starters.map(async (player) => {
        await session.createDocument(
          process.env.APPWRITE_DATABASE_ID!,
          'Lineups',
          ID.unique(),
          {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: player,
            position: starters.indexOf(player) + 1,
          },
        )
      }),
    )

    const bench = validateFields.data.bench
    await Promise.all(
      bench.map(async (player) => {
        await session.createDocument(
          process.env.APPWRITE_DATABASE_ID!,
          'Lineups',
          ID.unique(),
          {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: player,
            position: -1,
          },
        )
      }),
    )

    // Add goals
    const goals = validateFields.data.goals
    await Promise.all(
      goals.map(async (goal) => {
        await session.createDocument(
          process.env.APPWRITE_DATABASE_ID!,
          'Goals',
          ID.unique(),
          {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: goal.player,
            amount: goal.amount,
            goal_type: goal.type,
          },
        )
      }),
    )

    // Add assists
    const assists = validateFields.data.assists
    await Promise.all(
      assists.map(async (assist) => {
        await session.createDocument(
          process.env.APPWRITE_DATABASE_ID!,
          'Assists',
          ID.unique(),
          {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: assist.player,
            amount: assist.amount,
          },
        )
      }),
    )

    // Add yellow cards
    const yellowCards = validateFields.data.yellowCards
    await Promise.all(
      yellowCards.map(async (yellowCard) => {
        await session.createDocument(
          process.env.APPWRITE_DATABASE_ID!,
          'YellowCards',
          ID.unique(),
          {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: yellowCard.player,
            amount: yellowCard.amount,
          },
        )
      }),
    )

    // Add red cards
    const redCards = validateFields.data.redCards
    await Promise.all(
      redCards.map(async (redCard) => {
        await session.createDocument(
          process.env.APPWRITE_DATABASE_ID!,
          'RedCards',
          ID.unique(),
          {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: redCard,
          },
        )
      }),
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      return {
        errors: {
          season: [error.message],
        },
      }
    } else {
      return {
        errors: {
          season: ['An unknown error occurred while adding the match results'],
        },
      }
    }
  }

  return {
    successMessage: 'Match results added successfully',
  }
}

const standingsSchema = z.object({
  season: z.string().nonempty(),
  standings: z.array(
    z.object({
      id: z.string().nonempty(),
      played: z.number().int().gte(0),
      won: z.number().int().gte(0),
      drawn: z.number().int().gte(0),
      lost: z.number().int().gte(0),
    }),
  ),
})

export const updateStandings = async (
  _currentState: StandingsEditorState,
  formData: FormData,
) => {
  const validateFields = standingsSchema.safeParse({
    season: formData.get('season'),
    standings: JSON.parse((formData.get('standings') as string) || '[]'),
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }

  try {
    const session = await createDatabaseClientWithSession()

    const documents = await session.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      'Standings',
      [Query.equal('season', validateFields.data.season)],
    )

    const standings = documents.documents as Database['Standings'][]
    await Promise.all(
      validateFields.data.standings.map(async (team) => {
        const teamDocument = standings.find((t) => t.team.$id === team.id)
        if (teamDocument) {
          await session.updateDocument(
            process.env.APPWRITE_DATABASE_ID!,
            'Standings',
            teamDocument.$id,
            {
              played: team.played,
              won: team.won,
              drawn: team.drawn,
              lost: team.lost,
            },
          )
        }
      }),
    )
  } catch (error) {
    if (error instanceof AppwriteException) {
      return {
        errors: {
          standings: [error.message],
        },
      }
    } else {
      return {
        errors: {
          standings: ['An unknown error occurred while updating the standings'],
        },
      }
    }
  }

  return {
    successMessage: 'Standings updated successfully',
  }
}

export const redirectIfNotAdmin = async () => {
  const databaseClient = await createDatabaseClient()
  const { account } = await createSessionClient()
  const user = await account.get()
  const users = new Users(databaseClient.client)
  const results = await users.listMemberships(user.$id)
  if (
    !results.memberships.some((membership) => membership.teamName === 'Admins')
  ) {
    notFound()
  }
}
