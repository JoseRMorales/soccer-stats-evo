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

type Database = {
  Teams: Teams
  Matches: Matches
}
