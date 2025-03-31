import {
  getCurrentRound,
  getCurrentSeason,
  getPlayers,
  getSeasons,
  getTeams,
  redirectIfNotAdmin,
} from '@/app/actions'
import CreateMatchCard from '@/components/CreateMatchCard'
import MatchResultsCard from '@/components/MatchResultsCard'
import StandingsEditorCard from '@/components/StandingsEditorCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'

const AdminPage = async () => {
  await redirectIfNotAdmin()
  const seasons = await getSeasons()
  const currentSeason = await getCurrentSeason()
  const seasonsValues = seasons.map((season) => season.id)
  const currentRound = await getCurrentRound()
  const teams = await getTeams()
  const oponents = teams
    .filter((team) => team.owner === false)
    .map((team) => ({ value: team.$id, label: team.name }))
  const players = (await getPlayers(currentSeason)).map((player) => ({
    value: player.number.toString(),
    label: `${player.number} - ${player.name}`,
  }))
  const allTeams = teams.map((team) => ({ value: team.$id, label: team.name }))

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Tabs defaultValue="createMatch" className="max-w-xl w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="createMatch">Create Match</TabsTrigger>
          <TabsTrigger value="matchResults">Match Results</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
        </TabsList>
        <TabsContent value="createMatch">
          <CreateMatchCard
            seasons={seasonsValues}
            currentSeason={currentSeason}
            currentRound={currentRound.round}
            oponents={oponents}
          />
        </TabsContent>
        <TabsContent value="matchResults">
          <MatchResultsCard
            seasons={seasonsValues}
            currentSeason={currentSeason}
            currentRound={currentRound.round}
            players={players}
          />
        </TabsContent>
        <TabsContent value="standings">
          <StandingsEditorCard
            teams={allTeams}
            currentSeason={currentSeason}
            seasons={seasonsValues}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPage

export const dynamic = 'force-dynamic'
