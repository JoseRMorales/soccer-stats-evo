'use client'

import { Label } from '@radix-ui/react-label'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useActionState, useState } from 'react'
import { addMatchResults } from '@/app/actions'
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
import { MultiSelect } from '@/components/ui/multi-select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GoalType } from '@/types/database.types'

const initialState = {
  errors: {
    season: [] as string[],
    round: [] as string[],
    scored: [] as string[],
    received: [] as string[],
    starters: [] as string[],
    bench: [] as string[],
    goals: [] as string[],
    assists: [] as string[],
  },
}

type Options = {
  value: string
  label: string
}

const goalTypes = [
  { label: 'In Game', value: 'InGame' },
  { label: 'Penalty', value: 'Penalty' },
  { label: 'Free Kick', value: 'FreeKick' },
]

type GoalActionPlayers = {
  player: number
  type: GoalType
  amount: number
}

type ActionPlayers = {
  player: number
  amount: number
}

const MatchResultsCard = ({
  seasons,
  currentSeason,
  currentRound,
  players,
}: {
  seasons: string[]
  currentSeason: string
  currentRound: number | undefined
  players: Options[]
}) => {
  const [state, action] = useActionState(addMatchResults, initialState)
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)
  const [selectedStarters, setSelectedStarters] = useState<number[]>([])
  const [selectedBench, setSelectedBench] = useState<number[]>([])
  const [numberOfGoals, setNumberOfGoals] = useState(0)
  const [numberOfAssists, setNumberOfAssists] = useState(0)
  const [goals, setGoals] = useState<GoalActionPlayers[]>([])
  const [assists, setAssists] = useState<ActionPlayers[]>([])
  const [numberOfYellowCards, setNumberOfYellowCards] = useState(0)
  const [yellowCards, setYellowCards] = useState<ActionPlayers[]>([])
  const [redCards, setRedCards] = useState<number[]>([])

  const handleSubmit = async (formData: FormData) => {
    formData.append('season', selectedSeason)
    formData.append('starters', JSON.stringify(selectedStarters))
    formData.append('bench', JSON.stringify(selectedBench))
    formData.append('goals', JSON.stringify(goals))
    formData.append('assists', JSON.stringify(assists))
    formData.append('yellowCards', JSON.stringify(yellowCards))
    formData.append('redCards', JSON.stringify(redCards))

    return action(formData)
  }

  return (
    <form action={handleSubmit}>
      <Card>
        <ScrollArea className="h-[90vh]">
          <CardHeader>
            <CardTitle>Add Match Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-1">
                <Label htmlFor="round">Round</Label>
                <Input
                  id="round"
                  defaultValue={currentRound ? currentRound + 1 : 1}
                  type="number"
                  name="round"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="scored">Scored</Label>
                <Input
                  id="scored"
                  defaultValue={0}
                  type="number"
                  name="scored"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="received">Received</Label>
                <Input
                  id="received"
                  defaultValue={0}
                  type="number"
                  name="received"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <Label htmlFor="starters">Starters</Label>
                <MultiSelect
                  options={players}
                  onValueChange={(value: string[]) =>
                    setSelectedStarters(value.map((val) => parseInt(val)))
                  }
                  placeholder="Select starters"
                />
              </div>
              <div className="space-y-1"></div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <Label htmlFor="bench">Bench</Label>
                <MultiSelect
                  options={players}
                  onValueChange={(value: string[]) =>
                    setSelectedBench(value.map((val) => parseInt(val)))
                  }
                  placeholder="Select bench"
                />
              </div>
              <div className="space-y-1"></div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-4">
              <h2 className="text-lg font-semibold">Goals</h2>
            </div>
            {Array.from({ length: numberOfGoals }).map((_, index) => (
              <div className="grid grid-cols-5 gap-4" key={index}>
                <div key={index} className="space-y-1 col-span-2">
                  <Label>Player</Label>
                  <Combobox
                    options={players}
                    selected={goals[index]?.player.toString() || ''}
                    setSelected={(value: string) =>
                      setGoals((prev) => {
                        const newGoals = [...prev]
                        newGoals[index] = {
                          ...newGoals[index],
                          player: parseInt(value),
                        }
                        return newGoals
                      })
                    }
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label>Goal Type</Label>
                  <Combobox
                    options={goalTypes}
                    selected={goals[index]?.type || ''}
                    setSelected={(value: string) =>
                      setGoals((prev) => {
                        const newGoals = [...prev]
                        newGoals[index] = {
                          ...newGoals[index],
                          type: value as GoalType,
                        }
                        return newGoals
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Number</Label>
                  <Input
                    type="number"
                    defaultValue={goals[index]?.amount || 1}
                    onChange={(e) =>
                      setGoals((prev) => {
                        const newGoals = [...prev]
                        newGoals[index] = {
                          ...newGoals[index],
                          amount: parseInt(e.target.value),
                        }
                        return newGoals
                      })
                    }
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  setNumberOfGoals((prev) => prev + 1)
                  setGoals((prev) => {
                    const newGoals = [...prev]
                    newGoals.push({ player: -1, type: 'InGame', amount: 1 })
                    return newGoals
                  })
                }}
              >
                <IconPlus className="h-4 w-4" />
              </Button>
              {numberOfGoals > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    setNumberOfGoals((prev) => prev - 1)
                    setGoals((prev) => prev.slice(0, prev.length - 1))
                  }}
                >
                  <IconMinus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-2 gap-4">
              <h2 className="text-lg font-semibold">Assists</h2>
            </div>

            {Array.from({ length: numberOfAssists }).map((_, index) => (
              <div className="grid grid-cols-5 gap-4" key={index}>
                <div key={index} className="space-y-2 col-span-4">
                  <Label>Player</Label>
                  <Combobox
                    options={players}
                    selected={assists[index]?.player.toString() || ''}
                    setSelected={(value: string) =>
                      setAssists((prev) => {
                        const newAssists = [...prev]
                        newAssists[index] = {
                          ...newAssists[index],
                          player: parseInt(value),
                        }
                        return newAssists
                      })
                    }
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label>Number</Label>
                  <Input
                    type="number"
                    defaultValue={assists[index]?.amount || 1}
                    onChange={(e) =>
                      setAssists((prev) => {
                        const newAssists = [...prev]
                        newAssists[index] = {
                          ...newAssists[index],
                          amount: parseInt(e.target.value),
                        }
                        return newAssists
                      })
                    }
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  setNumberOfAssists((prev) => prev + 1)
                  setAssists((prev) => {
                    const newAssists = [...prev]
                    newAssists.push({ player: -1, amount: 1 })
                    return newAssists
                  })
                }}
              >
                <IconPlus className="h-4 w-4" />
              </Button>
              {numberOfAssists > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    setNumberOfAssists((prev) => prev - 1)
                    setAssists((prev) => prev.slice(0, prev.length - 1))
                  }}
                >
                  <IconMinus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-2 gap-4">
              <h2 className="text-lg font-semibold">Yellow Cards</h2>
            </div>
            {Array.from({ length: numberOfYellowCards }).map((_, index) => (
              <div className="grid grid-cols-5 gap-4" key={index}>
                <div key={index} className="space-y-1 col-span-4">
                  <Label>Player</Label>
                  <Combobox
                    options={players}
                    selected={yellowCards[index]?.player.toString() || ''}
                    setSelected={(value: string) =>
                      setYellowCards((prev) => {
                        const newYellowCards = [...prev]
                        newYellowCards[index] = {
                          ...newYellowCards[index],
                          player: parseInt(value),
                        }
                        return newYellowCards
                      })
                    }
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <Label>Number</Label>
                  <Input
                    type="number"
                    defaultValue={yellowCards[index]?.amount || 1}
                    onChange={(e) =>
                      setYellowCards((prev) => {
                        const newYellowCards = [...prev]
                        newYellowCards[index] = {
                          ...newYellowCards[index],
                          amount: parseInt(e.target.value),
                        }
                        return newYellowCards
                      })
                    }
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  setNumberOfYellowCards((prev) => prev + 1)
                  setYellowCards((prev) => {
                    const newYellowCards = [...prev]
                    newYellowCards.push({ player: -1, amount: 1 })
                    return newYellowCards
                  })
                }}
              >
                <IconPlus className="h-4 w-4" />
              </Button>
              {numberOfYellowCards > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    setNumberOfYellowCards((prev) => prev - 1)
                    setYellowCards((prev) => prev.slice(0, prev.length - 1))
                  }}
                >
                  <IconMinus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Row 7 */}
            <div className="grid grid-cols-2 gap-4">
              <h2 className="text-lg font-semibold">Red Cards</h2>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-1 col-span-4">
                <Label>Player</Label>
                <MultiSelect
                  options={players}
                  onValueChange={(value: string[]) =>
                    setRedCards(value.map((val) => parseInt(val)))
                  }
                  placeholder="Select players"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <SubmitButton>Save</SubmitButton>
            <div className="text-sm text-destructive">
              {state?.errors?.season && <p>{state.errors.season}</p>}
              {state?.errors?.round && <p>{state.errors.round}</p>}
              {state?.errors?.scored && <p>{state.errors.scored}</p>}
              {state?.errors?.received && <p>{state.errors.received}</p>}
              {state?.errors?.starters && <p>{state.errors.starters}</p>}
              {state?.errors?.bench && <p>{state.errors.bench}</p>}
              {state?.errors?.goals && <p>{state.errors.goals}</p>}
              {state?.errors?.assists && <p>{state.errors.assists}</p>}
              {state?.errors?.yellowCards && <p>{state.errors.yellowCards}</p>}
              {state?.errors?.redCards && <p>{state.errors.redCards}</p>}
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

export default MatchResultsCard
