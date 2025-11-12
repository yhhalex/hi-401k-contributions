'use client'

import { useEffect, useState } from 'react'

type HistoryRecord = {
  timestamp: string
  type: string | null
  value: number | null
  amount: number | null 
}

export default function ContributionHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history')
        if (res.ok) {
          const data = await res.json()
          setHistory(data.history || [])
        } else {
          setHistory([])
        }
      } catch {
        setHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return <p className="text-gray-500 text-sm mt-4">Loading history...</p>
  }

  if (history.length === 0) {
    return (
      <p className="text-gray-500 text-sm mt-4 text-center">
        No contributions yet.
      </p>
    )
  }

  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        Contribution History
      </h2>
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
                  {new Date(h.timestamp).toLocaleString()}
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
                  {h.amount ? `$${h.amount.toLocaleString()}` : '—'}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
