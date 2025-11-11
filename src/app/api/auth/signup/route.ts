import { NextResponse } from 'next/server'
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import path from 'path'
import { hashPassword } from '@/lib/auth'

type User = { username: string; passwordHash: string; token?: string }
type DB = { users: User[] }

const file = path.join(process.cwd(), 'data', 'users.json')
const adapter = new JSONFileSync<DB>(file)
const db = new LowSync(adapter, { users: [] })
db.read()

export async function POST(req: Request) {
  const { username, password } = await req.json()

  db.read()
  const exists = db.data.users.find(u => u.username === username)
  if (exists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  const passwordHash = await hashPassword(password)
  db.data.users.push({ username, passwordHash })
  db.write()

  return NextResponse.json({ success: true })
}
