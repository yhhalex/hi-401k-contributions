import { NextResponse } from 'next/server'

export async function GET() {
  // 1️⃣ Create response that redirects to /login
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))

  // 2️⃣ Clear the cookie
  response.cookies.set('session', '', {
    maxAge: 0,      // expire immediately
    path: '/',      // ensure it’s global
    httpOnly: true, // consistent with login
  })

  return response
}
