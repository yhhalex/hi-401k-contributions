import { NextResponse } from 'next/server'
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import path from 'path'
import { verifyPassword, generateToken } from '@/lib/auth'

type User = { username: string; passwordHash: string; token?: string }
type DB = { users: User[] }

const file = path.join(process.cwd(), 'data', 'users.json')
const adapter = new JSONFileSync<DB>(file)
const db = new LowSync(adapter, { users: [] })
db.read()

export async function POST(req: Request) {
  const { username, password } = await req.json()

  db.read()
  const user = db.data.users.find(u => u.username === username)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = generateToken()
  user.token = token
  db.write()

  const res = NextResponse.json({ success: true })
  res.cookies.set('session', token, {
    httpOnly: true,
    path: '/',
    maxAge: undefined, // cookie removed when browser is closed
  })  
  return res
}
