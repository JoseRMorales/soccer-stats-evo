import { createSessionClient } from '@/lib/appwrite/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession (request: NextRequest) {
  const response = NextResponse.next({
    request
  })
  let user = null
  try {
    const appwrite = await createSessionClient()
    user = await appwrite.account.get()
  } catch (error) {
    console.info('No session. Redirect.')
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}
