'use server'

import { APIError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const goToCurrentRound = async () => {
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

  redirect(`/${season}/${match?.round}`)
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
