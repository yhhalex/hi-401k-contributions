'use client'

import { useState, useEffect } from 'react'
import AuthModal from '@/components/AuthModal'

export default function HomePage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Check auth on mount
  useEffect(() => {
    fetch('/api/contribution').then((res) => {
      if (res.ok) setAuthenticated(true)
      else setAuthenticated(false)
    })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout')
    setAuthenticated(false)
    setShowModal(true)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {!authenticated ? (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Login / Sign Up
          </button>
          {showModal && (
            <AuthModal
              onClose={() => setShowModal(false)}
              onAuthSuccess={() => setAuthenticated(true)}
            />
          )}
        </>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-3 text-gray-800">
            Welcome back 👋
          </h1>
          <p>Your contribution data will go here.</p>
          <button
            onClick={handleLogout}
            className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </main>
  )
}
