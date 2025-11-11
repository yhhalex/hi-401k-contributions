'use client'

import { useState } from 'react'

type Mode = 'login' | 'signup'

export default function AuthModal({ onClose, onAuthSuccess }: { onClose: () => void, onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
    const body = mode === 'login' ? { username, password } : { username, password }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (res.ok) {
      onAuthSuccess()
      onClose()
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4 capitalize">
          {mode}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          )}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign up'}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button onClick={() => setMode('signup')} className="text-blue-600 hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Have an account?{' '}
              <button onClick={() => setMode('login')} className="text-blue-600 hover:underline">
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
