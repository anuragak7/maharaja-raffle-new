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
  const [spinAudio, setSpinAudio] = useState<HTMLAudioElement | null>(null)
  const [winnerAudio, setWinnerAudio] = useState<HTMLAudioElement | null>(null)

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

    // Initialize audio effects with Web Audio API
    const createSpinSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      const createBeep = (frequency: number, duration: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      }
      
      return {
        play: () => {
          // Create spinning sound effect
          const frequencies = [220, 330, 440, 550, 660]
          frequencies.forEach((freq, index) => {
            setTimeout(() => createBeep(freq, 0.1), index * 100)
          })
        }
      }
    }

    const createWinnerSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      return {
        play: () => {
          // Victory fanfare
          const notes = [
            { freq: 523, time: 0 },    // C
            { freq: 659, time: 0.2 },  // E
            { freq: 784, time: 0.4 },  // G
            { freq: 1047, time: 0.6 }, // C
          ]
          
          notes.forEach(note => {
            setTimeout(() => {
              const oscillator = audioContext.createOscillator()
              const gainNode = audioContext.createGain()
              
              oscillator.connect(gainNode)
              gainNode.connect(audioContext.destination)
              
              oscillator.frequency.value = note.freq
              oscillator.type = 'triangle'
              
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
              
              oscillator.start(audioContext.currentTime)
              oscillator.stop(audioContext.currentTime + 0.5)
            }, note.time * 1000)
          })
        }
      }
    }

    try {
      const spinSound = createSpinSound()
      const winSound = createWinnerSound()
      setSpinAudio(spinSound as any)
      setWinnerAudio(winSound as any)
    } catch (error) {
      console.log('Audio not supported:', error)
    }

    // Try to get real data from API
    fetchRealData()
  }, [])

  async function fetchRealData() {
    try {
      // First get all entries (not just summary)
      const entriesRes = await fetch('/api/entries', { cache: 'no-store' })
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json()
        if (entriesData.entries && entriesData.entries.length > 0) {
          setEntries(entriesData.entries)
          
          // Calculate counters from the full data
          const total = entriesData.entries.length
          const remaining = entriesData.entries.filter((e: Entry) => !e.hasWon).length
          const drawn = entriesData.entries.filter((e: Entry) => e.hasWon).length
          setCounters({ total, remaining, drawn })
          
          console.log('Loaded ALL entries:', { total, remaining, drawn })
          return
        }
      }
      
      // Fallback to summary if full entries fail
      const res = await fetch('/api/entries?summary=1', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data.sample && data.sample.length > 0) {
          setEntries(data.sample)
          setCounters(data.counters)
          console.log('Loaded sample data:', data.counters)
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

    // Play spinning sound
    if (spinAudio) {
      try {
        spinAudio.play()
        // Keep playing spin sound during the spin
        const spinInterval = setInterval(() => {
          if (spinAudio) spinAudio.play()
        }, 1000)
        
        setTimeout(() => {
          clearInterval(spinInterval)
        }, 5000)
      } catch (e) {
        console.log('Audio play failed:', e)
      }
    }

    // Show winner after quick 5-second spin
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
      
      // Play winner audio
      if (winnerAudio) {
        try {
          winnerAudio.play()
        } catch (e) {
          console.log('Winner audio play failed:', e)
        }
      }
      
      // Confetti
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
      })
      
      // More confetti after a delay
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.7 },
          colors: ['#FFD700', '#FFA500', '#FF4500', '#DC143C']
        })
      }, 500)
      
      console.log('Spin completed! Winner:', randomWinner.firstName, randomWinner.lastName)
    }, 5000) // 5 seconds total for quick spin
  }

  return (
    <main className="min-h-screen overflow-hidden p-6 bg-gradient-to-br from-purple-900 via-red-900 to-yellow-900">
      <div className="max-w-7xl mx-auto text-center h-full flex flex-col">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-4 text-center px-4">🎰 MAHARAJA BELLEROSE RAFFLE 🎰</h1>
        </div>

        {/* Casino Wheel - Medium Size */}
        <div className="relative mx-auto mb-8 flex-1 flex items-center justify-center">
          <div className="relative" style={{width: '500px', height: '500px'}}>
          <motion.div
            className="w-full h-full rounded-full border-8 border-yellow-400 relative shadow-2xl"
            animate={spinning ? { rotate: 3600 } : { rotate: 0 }}
            transition={{ 
              duration: 5, 
              ease: [0.4, 0.0, 0.2, 1],
              type: "tween"
            }}
            style={{
              background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fab1a0, #ff7675, #6c5ce7, #a29bfe, #fd79a8, #e17055, #00b894)',
              borderWidth: '8px'
            }}
          >
            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-600 shadow-xl">
                <span className="text-3xl">
                  {spinning ? '🎲' : '🎰'}
                </span>
              </div>
            </div>

            {/* Names around the wheel - show more available entries */}
            {entries.filter(entry => !entry.hasWon).slice(0, 16).map((entry, index) => {
              const angle = (360 / 16) * index
              const radian = (angle * Math.PI) / 180
              const radius = 160
              const x = Math.cos(radian) * radius
              const y = Math.sin(radian) * radius
              
              return (
                <div
                  key={entry.id}
                  className="absolute text-white font-bold text-base bg-black/80 px-3 py-2 rounded-lg shadow-lg border-2 border-yellow-400"
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
          
          {/* Pointer - pointing downwards into the wheel */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-14 bg-yellow-400 clip-triangle border-3 border-yellow-600 shadow-xl" style={{
              clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
              width: '28px',
              height: '56px'
            }}></div>
          </div>
          </div>
        </div>

        {/* Spin button */}
        <div className="mb-6">
        <button
          onClick={doSpin}
          disabled={spinning || counters.remaining <= 0}
          className={`px-12 py-6 text-2xl font-bold rounded-2xl transition-all transform ${
            spinning || counters.remaining <= 0
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-yellow-500 text-black hover:bg-yellow-400 cursor-pointer shadow-2xl hover:shadow-3xl hover:scale-110 animate-pulse'
          }`}
        >
          {spinning ? '🎲 SPINNING...' : 
           counters.remaining <= 0 ? '🚫 NO ENTRIES REMAINING' :
           '🎰 SPIN THE RAFFLE 🎰'}
        </button>
        </div>

        {/* Winner display - Enhanced Popup with Audio */}
        {winner && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-12 rounded-3xl shadow-2xl text-center max-w-4xl mx-4 border-8 border-yellow-300 animate-bounce-in relative overflow-hidden">
              {/* Animated background sparkles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 text-yellow-200 text-2xl animate-pulse">✨</div>
                <div className="absolute top-8 right-8 text-yellow-200 text-3xl animate-bounce">⭐</div>
                <div className="absolute bottom-6 left-6 text-yellow-200 text-2xl animate-spin">💫</div>
                <div className="absolute bottom-4 right-4 text-yellow-200 text-2xl animate-pulse">🌟</div>
              </div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl animate-pulse">WINNER!</h2>
                <div className="bg-white/20 backdrop-blur rounded-3xl p-8 mb-6 border-4 border-white/30">
                  <p className="text-5xl font-bold text-white mb-4">{winner.firstName} {winner.lastName}</p>
                  <p className="text-3xl text-yellow-100 font-semibold">{winner.phone}</p>
                </div>
                <div className="flex justify-center gap-8 text-6xl mb-8">
                  <span className="animate-spin">🎰</span>
                  <span className="animate-bounce">💰</span>
                  <span className="animate-pulse">🏆</span>
                  <span className="animate-bounce delay-100">🎊</span>
                  <span className="animate-spin delay-200">🌟</span>
                </div>
                <button
                  onClick={() => {
                    setWinner(null)
                  }}
                  className="bg-white text-black px-10 py-4 text-2xl font-bold rounded-2xl hover:bg-yellow-100 transition-all shadow-2xl transform hover:scale-110"
                >
                  🎊 CELEBRATE & CLOSE 🎊
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Debug info */}
        <div className="mt-4 p-4 bg-black/50 text-white rounded-lg text-sm">
          <p>Status: {spinning ? 'Spinning' : 'Ready'} | Entries: {entries.length} | Available: {counters.remaining}</p>
          <p className="text-xs mt-1">🔊 Audio: {spinAudio && winnerAudio ? 'Enabled' : 'Loading...'}</p>
        </div>
      </div>
    </main>
  )
}
