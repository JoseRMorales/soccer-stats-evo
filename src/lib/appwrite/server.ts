'use server'
import { cookies } from 'next/headers'
import { Account, Client, Databases, TablesDB } from 'node-appwrite'

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_URL!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)

  const cookiesData = await cookies()
  const session = cookiesData.get('appwrite-session')
  if (!session || !session.value) {
    throw new Error('No session')
  }

  client.setSession(session.value)

  return {
    get account() {
      return new Account(client)
    },
  }
}

export async function createClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_URL!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_KEY!)
    .setSession('')

  return {
    get account() {
      return new Account(client)
    },
  }
}

export async function createDatabaseClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_URL!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_KEY!)

  return new TablesDB(client)
}

export async function createDatabaseClientWithSession() {
  const { account } = await createSessionClient()

  return new TablesDB(account.client)
}
