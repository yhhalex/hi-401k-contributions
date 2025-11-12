import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import path from 'path'
import userDb from '@/lib/userDb'

type Store = {
  users: Record<
    string,
    {
      history?: {
        timestamp: string
        type: string
        value: number
        amount: number
      }[]
    }
  >
}

const file = path.join(process.cwd(), 'data', 'store.json')
const adapter = new JSONFileSync<Store>(file)
const db = new LowSync<Store>(adapter, { users: {} })
db.read()

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  userDb.read()
  const user = userDb.data.users.find(u => u.token === session)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  db.read()
  const userData = db.data.users[user.username]

  return NextResponse.json({
    history: userData?.history?.map(h => ({
      timestamp: h.timestamp,
      type: h.type,
      value: h.value,
      amount: h.amount ?? null,
    })) || [],
  })
}
