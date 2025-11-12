'use client'

import { useEffect, useState } from 'react'

type Props = {
  age: number
  salaryAnnual: number
  ytdContributions: number
  contributionType: 'percent' | 'fixed'
  contributionValue: number
  onAccept: (newValue: number, newType: 'percent' | 'fixed') => void
}

export default function ContributionImpact({
  age,
  salaryAnnual,
  ytdContributions,
  contributionType,
  contributionValue,
  onAccept
}: Props) {
  const [targetAge, setTargetAge] = useState(age)
  const [newType, setNewType] = useState<'percent' | 'fixed'>(contributionType)
  const [newValue, setNewValue] = useState(contributionValue)
  const [projectedCurrent, setProjectedCurrent] = useState(0)
  const [projectedNew, setProjectedNew] = useState(0)

  const annualReturn = 0.05 // 5% assumed annual return

  const calcFutureSavings = (annualContribution: number, years: number) => {
    let total = ytdContributions
    for (let i = 0; i < years; i++) {
      total += annualContribution
      total *= 1 + annualReturn
    }
    return total
  }

  useEffect(() => {
    const yearsLeft = Math.max(targetAge - age, 0)

    const annualContributionCurrent =
      contributionType === 'percent'
        ? salaryAnnual * (contributionValue / 100)
        : contributionValue

    const annualContributionNew =
      newType === 'percent'
        ? salaryAnnual * (newValue / 100)
        : newValue


    setProjectedCurrent(Math.round(calcFutureSavings(annualContributionCurrent, yearsLeft)))
    setProjectedNew(Math.round(calcFutureSavings(annualContributionNew, yearsLeft)))
  }, [targetAge, newType, newValue])

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Show Impact</h2>

      <div className="space-y-4">
        {/* Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project savings until age: <strong>{targetAge}</strong>
          </label>
          <input
            type="range"
            min={age}
            max={70}
            step={1}
            value={targetAge}
            onChange={(e) => setTargetAge(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        {/* Type toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose contribution type:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                value="percent"
                checked={newType === 'percent'}
                onChange={() => setNewType('percent')}
              />
              Percent
            </label>
            <label className="flex items-center gap-2 text-black">
              <input
                type="radio"
                value="fixed"
                checked={newType === 'fixed'}
                onChange={() => setNewType('fixed')}
              />
              Fixed
            </label>
          </div>
        </div>

        {/* New rate input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter new {newType === 'percent' ? 'percentage' : 'fixed'} amount:
          </label>
          <input
            type="number"
            min={newType === 'percent' ? 0 : 1}
            max={newType === 'percent' ? 100 : undefined}
            step={newType === 'percent' ? 1 : 50}
            value={newValue}
            onChange={(e) => setNewValue(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
          />
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Projected savings (current):</strong>{' '}
            ${projectedCurrent.toLocaleString()}
          </p>
          <p>
            <strong>Projected savings (new):</strong>{' '}
            ${projectedNew.toLocaleString()}
          </p>
          <p className="text-blue-600 font-medium">
            Difference: ${(projectedNew - projectedCurrent).toLocaleString()}
          </p>
        </div>

        {/* Accept button */}
        <button
          onClick={() => onAccept(newValue, newType)}
          className="mt-4 w-full bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700"
        >
          Accept New Plan
        </button>
      </div>
    </div>
  )
}
