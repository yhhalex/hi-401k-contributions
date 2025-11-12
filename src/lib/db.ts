import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import path from 'path'

type DBData = {
  snapshot: {
    salaryAnnual: number
    payFrequency: string
    ytdContributions: number
    age: number
  }
  selection: {
    type: 'percent' | 'fixed'
    value: number
  }
}

const file = path.join(process.cwd(), 'data', 'store.json')
const adapter = new JSONFileSync<DBData>(file)
const db = new LowSync<DBData>(adapter, {
  snapshot: {
    salaryAnnual: 120000,
    payFrequency: 'biweekly',
    ytdContributions: 6500,
    age: 30,
  },
  selection: {
    type: 'percent',
    value: 6,
  },
})


db.read()
db.write()

export default db
