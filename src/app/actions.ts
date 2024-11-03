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

export const matchTeams = async (season: string, round: number) => {
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
    .select('...Teams!inner(name)')
    .eq('season', season)
    .eq('round', round)
    .single()

  if (matchesError) {
    console.error(matchesError)
    throw new APIError(matchesError.message)
  }

  const opponentTeam = matchesData?.name

  return {
    ownerTeam,
    opponentTeam
  }
}