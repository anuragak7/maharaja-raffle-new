'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

type Entry = { id: string; firstName: string; lastName: string; phone: string; hasWon: boolean }

export default function DrawPage() {
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<Entry | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [counters, setCounters] = useState({ total: 0, remaining: 0, drawn: 0 })

  // Load test data and try to get real data
  useEffect(() => {
    // Set test data first
    const testEntries = [
      { id: '1', firstName: 'John', lastName: 'Doe', phone: '1234567890', hasWon: false },
      { id: '2', firstName: 'Jane', lastName: 'Smith', phone: '0987654321', hasWon: false },
      { id: '3', firstName: 'Bob', lastName: 'Johnson', phone: '1111111111', hasWon: false },
      { id: '4', firstName: 'Alice', lastName: 'Brown', phone: '2222222222', hasWon: false },
      { id: '5', firstName: 'Charlie', lastName: 'Wilson', phone: '3333333333', hasWon: false }
    ]
    setEntries(testEntries)
    setCounters({ total: testEntries.length, remaining: testEntries.length, drawn: 0 })

    // Try to get real data from API
    fetchRealData()
  }, [])

  async function fetchRealData() {
    try {
      const res = await fetch('/api/entries?summary=1', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data.sample && data.sample.length > 0) {
          setEntries(data.sample)
          setCounters(data.counters)
          console.log('Loaded real data:', data.counters)
        }
      }
    } catch (error) {
      console.log('Using test data, API failed:', error)
    }
  }

  async function doSpin() {
    console.log('Spin button clicked!')
    
    if (spinning) {
      console.log('Already spinning')
      return
    }

    // Filter out entries that have already won
    const availableEntries = entries.filter(entry => !entry.hasWon)
    
    if (availableEntries.length === 0) {
      console.log('No available entries (all have won or no entries)')
      alert('No available entries for the draw!')
      return
    }

    console.log('Starting spin...')
    setSpinning(true)
    setWinner(null)

    // Spin for 18 seconds with dramatic slowdown
    setTimeout(async () => {
      const randomWinner = availableEntries[Math.floor(Math.random() * availableEntries.length)]
      
      try {
        // Call the API to mark this entry as a winner
        const response = await fetch('/api/draw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ winnerId: randomWinner.id })
        })
        
        if (response.ok) {
          const data = await response.json()
          setWinner(data.winner)
          
          // Update the local entries to mark this person as won
          setEntries(prev => prev.map(entry => 
            entry.id === randomWinner.id 
              ? { ...entry, hasWon: true }
              : entry
          ))
          
          // Update counters based on current state
          setEntries(prevEntries => {
            const updatedEntries = prevEntries.map(entry => 
              entry.id === randomWinner.id 
                ? { ...entry, hasWon: true }
                : entry
            )
            const remaining = updatedEntries.filter(e => !e.hasWon).length
            const drawn = updatedEntries.filter(e => e.hasWon).length
            setCounters({ total: updatedEntries.length, remaining, drawn })
            return updatedEntries
          })
          
          console.log('Winner marked in database:', data.winner.firstName, data.winner.lastName)
        } else {
          // Fallback: just show winner but don't mark in database
          setWinner(randomWinner)
          console.log('API call failed, showing winner locally only')
        }
      } catch (error) {
        // Fallback: just show winner but don't mark in database
        setWinner(randomWinner)
        console.log('Error calling API, showing winner locally only:', error)
      }
      
      setSpinning(false)
      
      // Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      console.log('Spin completed! Winner:', randomWinner.firstName, randomWinner.lastName)
    }, 18000) // 18 seconds total
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-red-900 to-yellow-900">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-yellow-400 mb-6 whitespace-nowrap">🎰 HICKSVILLE RAFFLE 🎰</h1>
          <div className="flex justify-center gap-6 text-white">
            <div className="bg-black/50 px-6 py-3 rounded text-xl">Total: {counters.total}</div>
            <div className="bg-black/50 px-6 py-3 rounded text-xl">Remaining: {counters.remaining}</div>
            <div className="bg-black/50 px-6 py-3 rounded text-xl">Drawn: {counters.drawn}</div>
          </div>
        </div>

        {/* Casino Wheel */}
        <div className="relative mx-auto mb-8" style={{width: '600px', height: '600px'}}>
          <motion.div
            className="w-full h-full rounded-full border-12 border-yellow-400 relative"
            animate={spinning ? { rotate: 7200 } : { rotate: 0 }}
            transition={{ 
              duration: 18, 
              ease: [0.25, 0.1, 0.25, 1],
              type: "tween"
            }}
            style={{
              background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fab1a0, #ff7675, #6c5ce7, #a29bfe, #fd79a8, #e17055, #00b894)',
              borderWidth: '12px'
            }}
          >
            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-6 border-yellow-600">
                <span className="text-4xl">
                  {spinning ? '🎲' : '🎰'}
                </span>
              </div>
            </div>

            {/* Names around the wheel - show only available entries */}
            {entries.filter(entry => !entry.hasWon).slice(0, 8).map((entry, index) => {
              const angle = (360 / 8) * index
              const radian = (angle * Math.PI) / 180
              const radius = 210
              const x = Math.cos(radian) * radius
              const y = Math.sin(radian) * radius
              
              return (
                <div
                  key={entry.id}
                  className="absolute text-white font-bold text-lg bg-black/70 px-3 py-2 rounded"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  }}
                >
                  {entry.firstName}
                </div>
              )
            })}
          </motion.div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3">
            <div className="w-9 h-18 bg-yellow-400 clip-triangle border-3 border-yellow-600" style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              width: '36px',
              height: '72px'
            }}></div>
          </div>
        </div>

        {/* Spin button */}
        <button
          onClick={doSpin}
          disabled={spinning || counters.remaining <= 0}
          className={`px-12 py-6 text-3xl font-bold rounded-xl transition-all ${
            spinning || counters.remaining <= 0
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-yellow-500 text-black hover:bg-yellow-400 cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105'
          }`}
        >
          {spinning ? '🎲 SPINNING HICKSVILLE RAFFLE...' : 
           counters.remaining <= 0 ? '🚫 NO ENTRIES REMAINING' :
           '🎰 SPIN THE HICKSVILLE RAFFLE 🎰'}
        </button>

        {/* Winner display - Full Screen Popup */}
        {winner && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-16 rounded-3xl shadow-2xl text-center max-w-4xl mx-4 border-8 border-yellow-300 animate-bounce-in">
              <div className="text-9xl mb-8">🎉</div>
              <h2 className="text-8xl font-bold text-white mb-8 drop-shadow-lg">WINNER!</h2>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-12 mb-8">
                <p className="text-6xl font-bold text-white mb-4">{winner.firstName} {winner.lastName}</p>
                <p className="text-3xl text-yellow-100">{winner.phone}</p>
              </div>
              <div className="flex justify-center gap-6 text-8xl mb-8">
                <span className="animate-spin">🎰</span>
                <span className="animate-bounce">💰</span>
                <span className="animate-pulse">🏆</span>
              </div>
              <button
                onClick={() => setWinner(null)}
                className="bg-white text-black px-12 py-6 text-3xl font-bold rounded-xl hover:bg-yellow-100 transition-all shadow-lg"
              >
                🎊 CELEBRATE & CLOSE 🎊
              </button>
            </div>
          </div>
        )}

        {/* Debug info */}
        <div className="mt-8 p-4 bg-black/50 text-white rounded text-sm">
          <p>Status: {spinning ? 'Spinning' : 'Ready'}</p>
          <p>Entries loaded: {entries.length}</p>
          <p>Button disabled: {(spinning || counters.remaining <= 0).toString()}</p>
        </div>
      </div>
    </main>
  )
}
