'use client'

import { createMatch } from '@/app/actions'
import SubmitButton from '@/components/SubmitButton'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Combobox from '@/components/ui/combo-box'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { useActionState, useState } from 'react'

const initialState = {
  errors: {
    season: [] as string[],
    round: [] as string[],
    dateTime: [] as string[],
    opponent: [] as string[],
  },
}

type Options = {
  value: string
  label: string
}

const CreateMatchCard = ({
  seasons,
  currentSeason,
  currentRound,
  oponents,
}: {
  seasons: string[]
  currentSeason: string
  currentRound: number | undefined
  oponents: Options[]
}) => {
  const [state, action] = useActionState(createMatch, initialState)
  const [selectedSeason, setSelectedSeason] = useState(currentSeason)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedOpponent, setSelectedOpponent] = useState('')

  const handleSubmit = async (formData: FormData) => {
    formData.append('season', selectedSeason)
    formData.append('dateTime', selectedDate.toISOString())
    formData.append('opponent', selectedOpponent)
    return action(formData)
  }

  return (
    <form action={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create Match</CardTitle>
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
              <Label htmlFor="dateTime">Date and Time</Label>
              <DateTimePicker date={selectedDate} setDate={setSelectedDate} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="opponent">Opponent</Label>
              <Combobox
                options={oponents}
                selected={selectedOpponent}
                setSelected={setSelectedOpponent}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-4">
          <SubmitButton>Save</SubmitButton>
          <div className="text-sm text-destructive">
            {state?.errors?.season && <p>{state.errors.season}</p>}
            {state?.errors?.round && <p>{state.errors.round}</p>}
            {state?.errors?.dateTime && <p>{state.errors.dateTime}</p>}
            {state?.errors?.opponent && <p>{state.errors.opponent}</p>}
          </div>
          <div className="text-sm text-success">
            {state?.successMessage && <p>{state.successMessage}</p>}
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

export default CreateMatchCard
