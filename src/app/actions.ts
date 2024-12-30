'use server'

import { createClient } from '@/lib/appwrite/server'
import { APIError } from '@/lib/errors'
import { FormState, MatchStats } from '@/types/types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Client } from 'node-appwrite'
import { z } from 'zod'

export const getCurrentRound = async () => {
  const date = new Date()
  const month = date.getMonth()
  const day = date.getDate()
  const year = date.getFullYear()

  const currentYearSeason = month > 6 ? year : year - 1

  // Get only the last two digits of the year
  const currentYearSeasonShort = Number(currentYearSeason.toString().slice(-2))
  const season = `${currentYearSeasonShort}-${currentYearSeasonShort + 1}`

  const client = await createClient()
  const { data, error } = await client
    .from('Matches')
    .select('round, date')
    .eq('season', season)

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  const reversedMatches = data?.reverse()

  // Find the first match that has already been played
  const match = reversedMatches?.find((match) => {
    if (!match.date) return false
    const matchDate = new Date(match.date)
    return (
      matchDate.getMonth() < month ||
      (matchDate.getMonth() === month && matchDate.getDate() <= day)
    )
  })

  const round = match?.round

  return {
    season,
    round
  }
}

export const goToCurrentRound = async () => {
  const { season, round } = await getCurrentRound()

  redirect(`/season/${season}/round/${round}`)
}

export const getMatchTeams = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client
    .from('Teams')
    .select('name')
    .eq('owner', true)
    .single()

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  const ownerTeam = data?.name

  const { data: matchesData, error: matchesError } = await client
    .from('Matches')
    .select(
      `
    goals_scored,
    goals_conceded,
    ...Teams!inner(
      name
    )
    `
    )
    .eq('season', season)
    .eq('round', round)
    .single()

  if (matchesError) {
    console.error(matchesError)
    throw new APIError(matchesError.message)
  }

  const opponentTeam = matchesData?.name
  const scoredGoals = matchesData?.goals_scored
  const concededGoals = matchesData?.goals_conceded

  return {
    ownerTeam,
    opponentTeam,
    scoredGoals,
    concededGoals
  }
}

export const getMatchScorers = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_match_scorers', {
    input_round: round,
    input_season: season
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getMatchAssists = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_match_assists', {
    input_round: round,
    input_season: season
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getMatchYellowCards = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_match_yellow_cards', {
    input_round: round,
    input_season: season
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getMatchRedCards = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_match_red_cards', {
    input_round: round,
    input_season: season
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getMatchLineup = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_match_lineup', {
    input_round: round,
    input_season: season
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getPlayerInfo = async (season: string, playerNumber: number) => {
  const client = await createClient()
  const { data, error } = await client
    .from('Players')
    .select('name')
    .eq('season', season)
    .eq('number', playerNumber)
    .single()

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getNextRound = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client
    .from('Matches')
    .select('round')
    .eq('round', round + 1)
    .eq('season', season)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data ? round + 1 : null
}

export const getPlayedMatches = async (
  season: string,
  playerNumber: number
) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_played_games', {
    input_season: season,
    input_player: playerNumber
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data[0].played_matches
}

export const getGoalsNumber = async (season: string, playerNumber: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_goals_number', {
    input_season: season,
    input_player: playerNumber
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data[0].goals || 0
}

export const getAssistsNumber = async (
  season: string,
  playerNumber: number
) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_assists_number', {
    input_season: season,
    input_player: playerNumber
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }
  return data[0].assists || 0
}

export const getYellowCardsNumber = async (
  season: string,
  playerNumber: number
) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_yellow_cards_number', {
    input_season: season,
    input_player: playerNumber
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data[0].yellow_cards || 0
}

export const getRedCardsNumber = async (
  season: string,
  playerNumber: number
) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_red_cards_number', {
    input_season: season,
    input_player: playerNumber
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data[0].red_cards || 0
}

export const getPenaltiesSaved = async (
  season: string,
  playerNumber: number
): Promise<[number, number]> => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_penalties_saved', {
    input_season: season,
    input_player: playerNumber
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return [data[0].saved_penalties || 0, data[0].total_penalties || 0]
}

export const getPlayerStats = async (season: string, playerNumber: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_player_stats', {
    season_input: season,
    player_number: playerNumber
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data?.[0]
}

export const getMatchStats = async (
  season: string,
  round: number
): Promise<MatchStats> => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_match_stats', {
    input_round: round,
    input_season: season
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  const goals = data.filter((stat) => stat.stat_type === 'goal')
  const assists = data.filter((stat) => stat.stat_type === 'assist')
  const yellowCards = data.filter((stat) => stat.stat_type === 'yellow_card')
  const redCards = data.filter((stat) => stat.stat_type === 'red_card')

  return {
    goals,
    assists,
    yellowCards,
    redCards
  }
}

export const getStarters = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_starters', {
    input_season: season,
    input_round: round
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getBench = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_bench', {
    input_season: season,
    input_round: round
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getMatchDate = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client
    .from('Matches')
    .select(
      `
    date,
    time
    `
    )
    .eq('season', season)
    .eq('round', round)
    .single()

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  const date = data?.date
  const time = data?.time

  if (!date || !time) return null

  if (!time) return new Date(date)

  const dateTime = new Date(`${date}T${time}`)

  return dateTime
}

export const getPlayers = async (season: string) => {
  const client = await createClient()
  const { data, error } = await client
    .from('Players')
    .select('name, number')
    .eq('season', season)

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const isMatchPlayed = async (season: string, round: number) => {
  const client = await createClient()
  const { data, error } = await client
    .from('Matches')
    .select('played')
    .eq('season', season)
    .eq('round', round)
    .single()

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data?.played
}

export const getAllRounds = async () => {
  const client = await createClient()
  const { data, error } = await client.from('Matches').select(
    `
    season,
    round
    `
  )

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  return data
}

export const getStandings = async (season: string) => {
  const client = await createClient()
  const { data, error } = await client.rpc('get_standing', {
    season_input: season
  })

  if (error) {
    console.error(error)
    throw new APIError(error.message)
  }

  const standings = data
    .map((team) => {
      const points = team.won * 3 + team.drawn * 1

      return {
        ...team,
        points
      }
    })
    .sort((a, b) => b.points - a.points)

  return standings
}

const LoginFormSchema = z.object({
  username: z.string().trim().nonempty(),
  password: z.string().nonempty()
})

export async function login (state: FormState, formData: FormData) {
  const appwrite = await createClient()

  const validateFields = LoginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password')
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors
    }
  }

  // Workaround, altogether with the Supabase email verification skip, to avoid the need of a real email. Only for local deployment with preset users.
  const data = {
    email: `${validateFields.data.username}@login.local`,
    password: validateFields.data.password
  }

  try {
    const session = await appwrite.account.createEmailPasswordSession(
      data.email,
      data.password
    )
    const cookiesData = await cookies()
    cookiesData.set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
  } catch (error) {
    console.error(error)
    return {
      errors: {
        password: [error]
      }
    }
  }

  // Save the session in the cookie

  await goToCurrentRound()
}

export const logout = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()

  redirect('/login')
}
