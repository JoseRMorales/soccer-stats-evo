import { type NextRequest, NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/appwrite/server'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })
  let user = null
  try {
    const appwrite = await createSessionClient()
    user = await appwrite.account.get()
  } catch {
    console.info('No session. Redirect.')
  }

  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}
