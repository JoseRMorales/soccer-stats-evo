'use client'

import { login } from '@/app/actions'
import SubmitButton from '@/components/SubmitButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

const initialState = {
  errors: {
    username: [] as string[],
    password: [] as string[],
  },
}

const LoginForm = () => {
  const [state, action] = useActionState(login, initialState)

  return (
    <form action={action}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your username</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="username" name="username" required />
              <div className="mt-4 text-center text-sm text-destructive">
                {state?.errors?.username && <p>{state.errors.username}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" name="password" required />
              <div className="mt-4 text-center text-sm text-destructive">
                {state?.errors?.password && <p>{state.errors.password}</p>}
              </div>
            </div>
            <SubmitButton>Login</SubmitButton>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default LoginForm
