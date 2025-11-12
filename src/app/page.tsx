'use client'

import { useState, useEffect } from 'react'
import AuthModal from '@/components/AuthModal'

export default function HomePage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [snapshot, setSnapshot] = useState<any>({})
  const [selection, setSelection] = useState<any>({})
  const [history, setHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  // Fetch contribution data
  const fetchContribution = async () => {
    const res = await fetch('/api/contribution')
    if (res.ok) {
      const data = await res.json()
      setUsername(data.username)
      setSnapshot(data.snapshot)
      setSelection(data.selection)
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
  }

  // Fetch contribution history
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history')
      if (res.ok) {
        const data = await res.json()
        console.log('Fetched history:', data.history)
        setHistory(data.history || [])
      } else {
        setHistory([])
      }
    } catch (err) {
      console.error('Error fetching history:', err)
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchContribution()
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchHistory()
    }
  }, [authenticated])

  // Save edited contribution
  const handleSave = async () => {
    const updated = { snapshot, selection }

    await fetch('/api/contribution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })

    setShowEdit(false)
    await fetchContribution()
    await fetchHistory() // Refresh history
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
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
              onAuthSuccess={() => {
                setShowModal(false)
                fetchContribution()
              }}
            />
          )}
        </>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md text-gray-700 w-full max-w-6xl">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Welcome back, {username}! 👋
          </h1>

          {/* TWO-COLUMN LAYOUT: HISTORY LEFT | OVERVIEW RIGHT */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* LEFT: Contribution History */}
            <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                Contribution History
              </h2>

              {historyLoading ? (
                <p className="text-gray-500 text-sm">Loading history...</p>
              ) : history.length === 0 ? (
                <p className="text-gray-500 text-sm">No contributions yet.</p>
              ) : (
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left">Date</th>
                        <th className="px-3 py-2 text-left">Type</th>
                        <th className="px-3 py-2 text-left">Value</th>
                        <th className="px-3 py-2 text-left">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history
                        .slice()
                        .reverse()
                        .map((h, idx) => (
                          <tr key={idx} className="border-t border-gray-200">
                            <td className="px-3 py-2">
                              {new Date(h.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2">{h.type || '—'}</td>
                            <td className="px-3 py-2">
                              {h.type === 'percent'
                                ? `${h.value}%`
                                : h.value
                                ? `$${h.value}`
                                : '—'}
                            </td>
                            <td className="px-3 py-2">
                              {h.amount
                                ? `$${h.amount.toLocaleString()}`
                                : '—'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* RIGHT: Overview + Edit Modal */}
            <div className="flex-1 space-y-3 text-left">
            <p><strong>Annual Salary:</strong> ${snapshot.salaryAnnual ?? 'N/A'}</p>
            <p><strong>Pay Frequency:</strong> {snapshot.payFrequency ?? 'N/A'}</p>
            <p><strong>Age:</strong> {snapshot.age ?? 'N/A'}</p>
            <p><strong>Contribution Type:</strong> {selection.type ?? 'N/A'}</p>
            <p><strong>Contribution Value:</strong> {selection.value ?? 'N/A'}</p>

            <div className="mt-6 border-t pt-3 text-gray-800">
              <p className="text-base font-semibold">
                Total YTD Contributions:{" "}
                <span className="text-blue-600">
                  {snapshot.ytdContributions
                    ? `$${snapshot.ytdContributions.toLocaleString()}`
                    : `$0`}
                </span>
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setShowEdit(true)}
                className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={async () => {
                  await fetch('/api/auth/logout')
                  setAuthenticated(false)
                  setUsername(null)
                  setSnapshot({})
                  setSelection({})
                }}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          </div>

          {/* EDIT MODAL */}
          {showEdit && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">Edit Contribution</h2>

                {/* Annual Salary */}
                <label className="block text-sm font-medium">Annual Salary</label>
                <input
                  type="number"
                  min="0"
                  value={snapshot.salaryAnnual ?? ''}
                  onChange={(e) =>
                    setSnapshot({
                      ...snapshot,
                      salaryAnnual: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-md px-3 py-1 mb-3"
                />

                {/* Pay Frequency */}
                <label className="block text-sm font-medium">Pay Frequency</label>
                <select
                  value={snapshot.payFrequency ?? ''}
                  onChange={(e) =>
                    setSnapshot({ ...snapshot, payFrequency: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-1 mb-3"
                >
                  <option value="">Select...</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>

                {/* Age */}
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  min="0"
                  value={snapshot.age ?? ''}
                  onChange={(e) =>
                    setSnapshot({ ...snapshot, age: Number(e.target.value) })
                  }
                  className="w-full border rounded-md px-3 py-1 mb-3"
                />

                {/* Contribution Type */}
                <label className="block text-sm font-medium">
                  Contribution Type
                </label>
                <select
                  value={selection.type ?? ''}
                  onChange={(e) =>
                    setSelection({ ...selection, type: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-1 mb-3"
                >
                  <option value="">Select...</option>
                  <option value="percent">Percent</option>
                  <option value="dollar">Dollar</option>
                </select>

                {/* Contribution Value */}
                <label className="block text-sm font-medium">
                  Contribution Value ({selection.type === 'percent' ? '%' : '$'})
                </label>
                <input
                  type="number"
                  min={selection.type === 'percent' ? 0 : 1}
                  max={selection.type === 'percent' ? 100 : undefined}
                  value={selection.value ?? ''}
                  onChange={(e) =>
                    setSelection({
                      ...selection,
                      value: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-md px-3 py-1 mb-1"
                />

                {/* ⚠️ Validation */}
                {selection.type === 'percent' &&
                  (selection.value < 0 || selection.value > 100) && (
                    <p className="text-red-600 text-sm mb-2">
                      Percentage must be between 0 and 100.
                    </p>
                  )}
                {selection.type === 'dollar' && selection.value <= 0 && (
                  <p className="text-red-600 text-sm mb-2">
                    Dollar amount must be a positive number.
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowEdit(false)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={
                      (selection.type === 'percent' &&
                        (selection.value < 0 || selection.value > 100)) ||
                      (selection.type === 'dollar' && selection.value <= 0)
                    }
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
