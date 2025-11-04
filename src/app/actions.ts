'use server'

import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { AppwriteException, ID, Query, Users } from 'node-appwrite'
import { z } from 'zod'
import {
  createClient,
  createDatabaseClient,
  createDatabaseClientWithSession,
  createSessionClient,
} from '@/lib/appwrite/server'
import { APIError } from '@/lib/errors'
import {
  Assists,
  Goals,
  Lineups,
  Matches,
  PenaltiesAgainst,
  Players,
  RedCards,
  Seasons,
  Standings,
  Teams,
  YellowCards,
} from '@/types/appwrite'
import {
  FormState,
  MatchFormState,
  MatchResultsState,
  MatchStats,
  PlayerStats,
  StandingsEditorState,
} from '@/types/types'

export const getCurrentSeason = async () => {
  const client = await createDatabaseClient()

  let data
  try {
    const rowList = await client.listRows<Seasons>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Seasons',
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const orderedSeasons = data.sort((a, b) => b.order - a.order)
  return orderedSeasons[0].id
}

export const getCurrentRound = async () => {
  const season = await getCurrentSeason()

  const client = await createDatabaseClient()
  let data
  try {
    const rowList = await client.listRows<Matches>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Matches',
      queries: [Query.equal('season', season)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const reversedMatches = data.reverse()

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
    const rowList = await client.listRows<Teams>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Teams',
      queries: [Query.equal('owner', true), Query.limit(1)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const ownerTeam = data[0].name

  let matchesData
  try {
    const rowList = await client.listRows<Matches>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Matches',
      queries: [
        Query.equal('season', season),
        Query.equal('round', round),
        Query.limit(1),
      ],
    })
    matchesData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const match = matchesData[0]

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
    const rowList = await client.listRows<Goals>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Goals',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const goals = data
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
    const rowList = await client.listRows<Assists>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Assists',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const assists = data
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
    const rowList = await client.listRows<YellowCards>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'YellowCards',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const yellowCards = data
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
    const rowList = await client.listRows<RedCards>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'RedCards',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const redCards = data
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
    const rowList = await client.listRows<Players>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Players',
      queries: [
        Query.and([
          Query.equal('season', season),
          Query.equal('number', playerNumber),
        ]),
      ],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  return data[0]
}

export const getNextRound = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data
  try {
    const rowList = await client.listRows<Matches>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Matches',
      queries: [
        Query.equal('season', season),
        Query.equal('round', round + 1),
        Query.limit(1),
      ],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  return data[0]?.round
}

export const getPlayedMatches = async (
  season: string,
  playerNumber: number,
) => {
  const client = await createDatabaseClient()
  let playedMatchesData

  try {
    const rowList = await client.listRows<Lineups>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Lineups',
      queries: [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    })
    playedMatchesData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }
  return playedMatchesData.length
}

export const getGoalsNumber = async (season: string, playerNumber: number) => {
  const client = await createDatabaseClient()

  let totalGoalsData
  try {
    const rowList = await client.listRows<Goals>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Goals',
      queries: [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    })
    totalGoalsData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const totalGoals = totalGoalsData.reduce(
    (acc: number, goal: Goals) => acc + goal.amount,
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
    const rowList = await client.listRows<Assists>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Assists',
      queries: [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    })
    totalAssistsData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const totalAssists = totalAssistsData.reduce(
    (acc: number, assist: Assists) => acc + assist.amount,
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
    const rowList = await client.listRows<YellowCards>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'YellowCards',
      queries: [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    })
    totalYellowCardsData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const totalYellowCards = totalYellowCardsData.reduce(
    (acc: number, yellowCard: YellowCards) => acc + yellowCard.amount,
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
    const rowList = await client.listRows<RedCards>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'RedCards',
      queries: [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    })
    redCardsData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  return redCardsData.length
}

export const getPenaltiesSaved = async (
  season: string,
  playerNumber: number,
): Promise<[number, number]> => {
  const client = await createDatabaseClient()
  let totalPenaltiesSavedData
  try {
    const rowList = await client.listRows<PenaltiesAgainst>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'PenaltiesAgainst',
      queries: [
        Query.and([
          Query.equal('season', season),
          Query.equal('player', playerNumber),
        ]),
      ],
    })
    totalPenaltiesSavedData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const totalPenaltiesSaved = totalPenaltiesSavedData.reduce(
    (acc: number, penalty: PenaltiesAgainst) => acc + penalty.amount,
    0,
  )

  const totalPenalties = totalPenaltiesSavedData.reduce(
    (acc: number, penalty: PenaltiesAgainst) => acc + penalty.saved,
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
    const rowList = await client.listRows<Goals>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Goals',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    goalsData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const goals = goalsData
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
    const rowList = await client.listRows<Assists>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Assists',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    assistsData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const assists = assistsData
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
    const rowList = await client.listRows<YellowCards>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'YellowCards',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    yellowCardsData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const yellowCards = yellowCardsData
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
    const rowList = await client.listRows<RedCards>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'RedCards',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    redCardsData = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const redCards = redCardsData
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
    data = await client.listRows<Lineups>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Lineups',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const lineupData = data.rows
  const starters = lineupData.filter((player) => player.position !== -1)

  return starters
}

export const getBench = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data
  try {
    const rowList = await client.listRows<Lineups>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Lineups',
      queries: [Query.equal('season', season), Query.equal('round', round)],
    })
    data = rowList
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }
  const lineupData = data.rows
  const bench = lineupData.filter((player) => player.position === -1)

  return bench
}

export const getMatchDate = async (season: string, round: number) => {
  const client = await createDatabaseClient()
  let data

  try {
    const rowList = await client.listRows<Matches>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Matches',
      queries: [
        Query.and([Query.equal('season', season), Query.equal('round', round)]),
      ],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const match = data[0]
  const datetime = match.datetime
  if (!datetime) {
    throw new APIError('Match datetime is missing')
  }
  return new Date(datetime)
}

export const getPlayers = async (season: string) => {
  const client = await createDatabaseClient()
  let data
  try {
    const rowList = await client.listRows<Players>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Players',
      queries: [Query.equal('season', season)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  return data
}

export const isMatchPlayed = async (season: string, round: number) => {
  const client = await createDatabaseClient()

  let data
  try {
    const rowList = await client.listRows<Matches>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Matches',
      queries: [
        Query.and([Query.equal('season', season), Query.equal('round', round)]),
      ],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const match = data[0]

  return match.played
}

export const getStandings = async (season: string) => {
  const client = await createDatabaseClient()
  let data
  try {
    const rowList = await client.listRows<Standings>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Standings',
      queries: [Query.equal('season', season), Query.select(['*', 'team.*'])],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }
  const standings = data
    .map((standing) => {
      const points = standing.won * 3 + standing.drawn * 1
      return {
        ...standing,
        points,
        name: standing.team.name,
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
    data = await client.listRows<Seasons>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Seasons',
    })
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const seasons = data.rows

  return seasons
}

export const getTeams = async () => {
  const client = await createDatabaseClient()
  let data
  try {
    const rowList = await client.listRows<Teams>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Teams',
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  return data
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
    await session.createRow({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Matches',
      rowId: ID.unique(),
      data: {
        season: validateFields.data.season,
        round: validateFields.data.round,
        datetime: validateFields.data.dateTime,
        opponent: validateFields.data.opponent,
        played: false,
      },
    })
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
    const matchRowList = await session.listRows<Matches>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Matches',
      queries: [
        Query.and([
          Query.equal('season', validateFields.data.season),
          Query.equal('round', validateFields.data.round),
        ]),
      ],
    })
    const match = matchRowList.rows[0]
    await session.updateRow({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Matches',
      rowId: match.$id,
      data: {
        goals_scored: validateFields.data.scored,
        goals_conceded: validateFields.data.received,
        played: true,
      },
    })

    // Add lineup
    const starters = validateFields.data.starters
    await Promise.all(
      starters.map(async (player) => {
        await session.createRow({
          databaseId: process.env.APPWRITE_DATABASE_ID!,
          tableId: 'Lineups',
          rowId: ID.unique(),
          data: {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: player,
            position: starters.indexOf(player) + 1,
          },
        })
      }),
    )

    const bench = validateFields.data.bench
    await Promise.all(
      bench.map(async (player) => {
        await session.createRow({
          databaseId: process.env.APPWRITE_DATABASE_ID!,
          tableId: 'Lineups',
          rowId: ID.unique(),
          data: {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: player,
            position: -1,
          },
        })
      }),
    )

    // Add goals
    const goals = validateFields.data.goals
    await Promise.all(
      goals.map(async (goal) => {
        await session.createRow({
          databaseId: process.env.APPWRITE_DATABASE_ID!,
          tableId: 'Goals',
          rowId: ID.unique(),
          data: {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: goal.player,
            amount: goal.amount,
            goal_type: goal.type,
          },
        })
      }),
    )

    // Add assists
    const assists = validateFields.data.assists
    await Promise.all(
      assists.map(async (assist) => {
        await session.createRow({
          databaseId: process.env.APPWRITE_DATABASE_ID!,
          tableId: 'Assists',
          rowId: ID.unique(),
          data: {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: assist.player,
            amount: assist.amount,
          },
        })
      }),
    )

    // Add yellow cards
    const yellowCards = validateFields.data.yellowCards
    await Promise.all(
      yellowCards.map(async (yellowCard) => {
        await session.createRow({
          databaseId: process.env.APPWRITE_DATABASE_ID!,
          tableId: 'YellowCards',
          rowId: ID.unique(),
          data: {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: yellowCard.player,
            amount: yellowCard.amount,
          },
        })
      }),
    )

    // Add red cards
    const redCards = validateFields.data.redCards
    await Promise.all(
      redCards.map(async (redCard) => {
        await session.createRow({
          databaseId: process.env.APPWRITE_DATABASE_ID!,
          tableId: 'RedCards',
          rowId: ID.unique(),
          data: {
            season: validateFields.data.season,
            round: validateFields.data.round,
            player: redCard,
          },
        })
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

    const rowList = await session.listRows<Standings>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Standings',
      queries: [Query.equal('season', validateFields.data.season)],
    })
    const standings = rowList.rows
    await Promise.all(
      validateFields.data.standings.map(async (team) => {
        const teamDocument = standings.find(
          (t: Standings) => t.team.$id === team.id,
        )
        if (teamDocument) {
          await session.updateRow({
            databaseId: process.env.APPWRITE_DATABASE_ID!,
            tableId: 'Standings',
            rowId: teamDocument.$id,
            data: {
              played: team.played,
              won: team.won,
              drawn: team.drawn,
              lost: team.lost,
            },
          })
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
  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    notFound()
  }
}

export const isAdmin = async () => {
  const databaseClient = await createDatabaseClient()
  const { account } = await createSessionClient()
  const user = await account.get()
  const users = new Users(databaseClient.client)
  const results = await users.listMemberships(user.$id)
  return results.memberships.some(
    (membership) => membership.teamName === 'Admins',
  )
}

export const getTopAssists = async (season: string) => {
  const client = await createDatabaseClient()
  let data
  try {
    const rowList = await client.listRows<Assists>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Assists',
      queries: [Query.equal('season', season)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const assists = data

  const playerAssistsMap = new Map<number, number>()
  assists.forEach((assist) => {
    const currentAssists = playerAssistsMap.get(assist.player) || 0
    playerAssistsMap.set(assist.player, currentAssists + assist.amount)
  })

  const assistStats = await Promise.all(
    Array.from(playerAssistsMap.entries()).map(
      async ([playerNumber, totalAssists]) => {
        const playerInfo = await getPlayerInfo(season, playerNumber)
        return {
          player_name: playerInfo.name,
          player_number: playerNumber,
          assists: totalAssists,
        }
      },
    ),
  )

  return assistStats.sort((a, b) => b.assists - a.assists)
}

export const getTopGoals = async (season: string) => {
  const client = await createDatabaseClient()
  let data
  try {
    const rowList = await client.listRows<Goals>({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: 'Goals',
      queries: [Query.equal('season', season)],
    })
    data = rowList.rows
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new APIError(error.message)
    } else {
      throw new APIError('An unknown error occurred while fetching the data')
    }
  }

  const goals = data

  const playerGoalsMap = new Map<number, number>()
  goals.forEach((goal) => {
    const currentGoals = playerGoalsMap.get(goal.player) || 0
    playerGoalsMap.set(goal.player, currentGoals + goal.amount)
  })

  const goalStats = await Promise.all(
    Array.from(playerGoalsMap.entries()).map(
      async ([playerNumber, totalGoals]) => {
        const playerInfo = await getPlayerInfo(season, playerNumber)
        return {
          player_name: playerInfo.name,
          player_number: playerNumber,
          goals: totalGoals,
        }
      },
    ),
  )

  return goalStats.sort((a, b) => b.goals - a.goals)
}

type PlayerGoalsAndAssists = {
  player_name: string
  player_number: number
  goals: number
  assists: number
  amount: number
}

export const getTopGoalsAndAssists = async (
  season: string,
): Promise<PlayerGoalsAndAssists[]> => {
  const goals = await getTopGoals(season)
  const assists = await getTopAssists(season)

  const playerStatsMap = new Map<number, PlayerGoalsAndAssists>()

  goals.forEach((goal) => {
    playerStatsMap.set(goal.player_number, {
      player_name: goal.player_name,
      player_number: goal.player_number,
      goals: goal.goals,
      assists: 0,
      amount: goal.goals,
    })
  })

  assists.forEach((assist) => {
    if (playerStatsMap.has(assist.player_number)) {
      const playerData = playerStatsMap.get(assist.player_number)!
      playerData.assists = assist.assists
      playerData.amount += assist.assists
    } else {
      playerStatsMap.set(assist.player_number, {
        player_name: assist.player_name,
        player_number: assist.player_number,
        goals: 0,
        assists: assist.assists,
        amount: assist.assists,
      })
    }
  })

  const goalsAndAssists = Array.from(playerStatsMap.values())
  const sortedData = goalsAndAssists.sort((a, b) => b.amount - a.amount)

  return sortedData
}
