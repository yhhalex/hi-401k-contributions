import { NextResponse } from 'next/server'
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import path from 'path'
import { hashPassword } from '@/lib/auth'

// User DB
type User = { username: string; passwordHash: string; token?: string }
type DB = { users: User[] }

const file = path.join(process.cwd(), 'data', 'users.json')
const adapter = new JSONFileSync<DB>(file)
const db = new LowSync(adapter, { users: [] })
db.read()

// Contribution Store DB
type Contribution = {
  snapshot: {
    salaryAnnual: number | null
    payFrequency: string | null
    ytdContributions: number | null
    age: number | null
  }
  selection: {
    type: 'percent' | 'dollar' | null
    value: number | null
  }
  history: []
}
type Store = { users: Record<string, Contribution> }

const storeFile = path.join(process.cwd(), 'data', 'store.json')
const storeAdapter = new JSONFileSync<Store>(storeFile)
const storeDb = new LowSync<Store>(storeAdapter, { users: {} })
storeDb.read()

export async function POST(req: Request) {
  const { username, password } = await req.json()

  db.read()
  const exists = db.data.users.find(u => u.username === username)
  if (exists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  // Create new user
  const passwordHash = await hashPassword(password)
  db.data.users.push({ username, passwordHash })
  db.write()

  // Initialize empty contribution data for the new user
  storeDb.read()
  storeDb.data.users[username] = {
    snapshot: {
      salaryAnnual: 0,
      payFrequency: '',
      ytdContributions: 0,
      age: null,
    },
    selection: {
      type: null,
      value: null,
    },
    history: [],
  }
  storeDb.write()

  return NextResponse.json({ success: true })
}
