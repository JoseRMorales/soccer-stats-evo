interface Teams {
  name: string
  owner: boolean
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  $databaseId: string
  $collectionId: string
}

interface Matches {
  round: number
  goals_scored: number | null
  goals_conceded: number | null
  datetime: string
  season: string
  played: boolean | null
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  opponent: Teams
  $databaseId: string
  $collectionId: string
}

interface Standings {
  played: number
  won: number
  drawn: number
  lost: number
  season: string
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  team: Teams
  $databaseId: string
  $collectionId: string
}

interface Players {
  number: number
  name: string
  season: string
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  $databaseId: string
  $collectionId: string
}

interface Lineups {
  round: number
  player: number
  position: number
  season: string
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  $databaseId: string
  $collectionId: string
}

export type GoalType = 'InGame' | 'Penalty' | 'FreeKick'

interface Goals {
  round: number
  player: number
  amount: number
  season: string
  goal_type: GoalType
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  $databaseId: string
  $collectionId: string
}

interface Assists {
  round: number
  player: number
  amount: number
  season: string
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  $databaseId: string
  $collectionId: string
}

interface YellowCards {
  round: number
  player: number
  amount: number
  season: string
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  $databaseId: string
  $collectionId: string
}

interface RedCards {
  round: number
  player: number
  season: string
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  $databaseId: string
  $collectionId: string
}

interface Seasons {
  id: string
  order: number
  $id: string
  $createdAt: string
  $updatedAt: string
  $permissions: any[]
  $databaseId: string
  $collectionId: string
}

export interface Database {
  Teams: Teams
  Matches: Matches
  Standings: Standings
  Players: Players
  Lineups: Lineups
  Goals: Goals
  Assists: Assists
  YellowCards: YellowCards
  RedCards: RedCards
  Seasons: Seasons
}
