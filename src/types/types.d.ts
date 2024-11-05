export interface PlayerCardInfo {
  name: string
  number: number
  playedMatches: number
  assists: number
  goals: number
  yellowCards: number
  redCards: number
  penalties: [number, number]
}
