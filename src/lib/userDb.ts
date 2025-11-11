import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import path from 'path'

type User = { username: string; passwordHash: string; token?: string }
type UserDB = { users: User[] }

const file = path.join(process.cwd(), 'data', 'users.json')
const adapter = new JSONFileSync<UserDB>(file)
const db = new LowSync<UserDB>(adapter, { users: [] })

db.read()
db.write()

export default db
export type { User }
