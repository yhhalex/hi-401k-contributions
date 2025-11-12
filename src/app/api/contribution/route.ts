import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import path from 'path'
import userDb from '@/lib/userDb'

interface Contribution {
  snapshot: {
    salaryAnnual: number
    ytdContributions: number
    age: number
  }
  selection: {
    type: 'percent' | 'fixed'
    value: number
  }
}

interface Store {
  users: Record<string, Contribution>
}

const file = path.join(process.cwd(), 'data', 'store.json')
const adapter = new JSONFileSync<Store>(file)
const db = new LowSync<Store>(adapter, { users: {} })
db.read()

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  userDb.read()
  const user = userDb.data.users.find((u) => u.token === session)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  db.read()
  const data = db.data.users[user.username]

  if (!data) {
    return NextResponse.json({ error: 'No data for this user' }, { status: 404 })
  }

  return NextResponse.json({
    username: user.username,
    snapshot: data.snapshot,
    selection: data.selection,
  })
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  userDb.read()
  const user = userDb.data.users.find((u) => u.token === session)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  db.read()

  // Ensure we don't lose history
  const existing = db.data.users[user.username] || {}
  db.data.users[user.username] = {
    ...existing, // preserve history and anything else
    snapshot: body.snapshot,
    selection: body.selection,
  }

  db.write()


  return NextResponse.json(db.data.users[user.username])
}

