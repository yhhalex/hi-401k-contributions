import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  db.read()
  return NextResponse.json(db.data)
}

export async function POST(req: Request) {
  const body = await req.json()
  db.read()
  db.data.selection = body.selection
  db.write()
  return NextResponse.json(db.data)
}
