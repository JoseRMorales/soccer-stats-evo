'use client'

import { updateStandings } from '@/app/actions'
import SubmitButton from '@/components/SubmitButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Combobox from '@/components/ui/combo-box'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useActionState, useState } from 'react'

const initialState = {
  errors: {
    season: [] as string[],
    standings: [] as string[],
  },
}

type Options = {
  value: string
  label: string
}

type StandingsTeam = {
  id: string
  played: number
  won: number
  drawn: number
  lost: number
}

const StandingsEditorCard = ({
  teams,
  currentSeason,
  seasons,
}: {
  teams: Options[]
  seasons: string[]
  currentSeason: string
}) => {
  const [state, action] = useActionState(updateStandings, initialState)
  const [standings, setStandings] = useState<StandingsTeam[]>([])
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)
  const [numberOfTeams, setNumberOfTeams] = useState(0)

  const handleSubmit = async (formData: FormData) => {
    formData.append('season', selectedSeason)
    formData.append('standings', JSON.stringify(standings))
    return action(formData)
  }

  return (
    <form action={handleSubmit}>
      <Card>
        <ScrollArea className="h-[90vh]">
          <CardHeader>
            <CardTitle>Edit standings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <Label htmlFor="season">Season</Label>
                <Combobox
                  options={seasons.map((season) => ({
                    value: season,
                    label: season,
                  }))}
                  selected={selectedSeason}
                  setSelected={setSelectedSeason}
                />
              </div>
            </div>
            {/* Row 2 */}
            {Array.from({ length: numberOfTeams }).map((_, index) => (
              <div key={index} className="grid gap-4 grid-cols-6">
                <div className="space-y-1 col-span-2">
                  <Label htmlFor={`team-${index}`}>Team</Label>
                  <Combobox
                    options={teams}
                    selected={standings[index]?.id || ''}
                    setSelected={(value) => {
                      setStandings((prev) => {
                        const newStandings = [...prev]
                        newStandings[index] = {
                          ...newStandings[index],
                          id: value,
                        }
                        return newStandings
                      })
                    }}
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label htmlFor={`played-${index}`}>Played</Label>
                  <Input
                    type="number"
                    id={`played-${index}`}
                    value={standings[index]?.played}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setStandings((prev) => {
                        const newStandings = [...prev]
                        newStandings[index].played = value
                        return newStandings
                      })
                    }}
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label htmlFor={`won-${index}`}>Won</Label>
                  <Input
                    type="number"
                    id={`won-${index}`}
                    value={standings[index]?.won}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setStandings((prev) => {
                        const newStandings = [...prev]
                        newStandings[index].won = value
                        return newStandings
                      })
                    }}
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label htmlFor={`drawn-${index}`}>Drawn</Label>
                  <Input
                    type="number"
                    id={`drawn-${index}`}
                    value={standings[index]?.drawn}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setStandings((prev) => {
                        const newStandings = [...prev]
                        newStandings[index].drawn = value
                        return newStandings
                      })
                    }}
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label htmlFor={`lost-${index}`}>Lost</Label>
                  <Input
                    type="number"
                    id={`lost-${index}`}
                    value={standings[index]?.lost}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setStandings((prev) => {
                        const newStandings = [...prev]
                        newStandings[index].lost = value
                        return newStandings
                      })
                    }}
                  />
                </div>
              </div>
            ))}
            {/* Row 3 */}

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  setNumberOfTeams((prev) => prev + 1)
                  setStandings((prev) => {
                    const newStandings = [...prev]
                    newStandings.push({
                      id: '',
                      played: 0,
                      won: 0,
                      drawn: 0,
                      lost: 0,
                    })
                    return newStandings
                  })
                }}
              >
                <IconPlus className="h-4 w-4" />
              </Button>
              {numberOfTeams > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    setNumberOfTeams((prev) => prev - 1)
                    setStandings((prev) => {
                      const newStandings = [...prev]
                      newStandings.pop()
                      return newStandings
                    })
                  }}
                >
                  <IconMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <SubmitButton>Save</SubmitButton>
            <div className="text-sm text-destructive">
              {state?.errors?.season && <p>{state.errors.season}</p>}
              {state?.errors?.standings && <p>{state.errors.standings}</p>}
            </div>
            <div className="text-sm text-success">
              {state?.successMessage && <p>{state.successMessage}</p>}
            </div>
          </CardFooter>
        </ScrollArea>
      </Card>
    </form>
  )
}

export default StandingsEditorCard
