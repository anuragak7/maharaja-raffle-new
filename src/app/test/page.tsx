'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function TestPage() {
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  const testNames = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson']

  async function doSpin() {
    console.log('Spin button clicked!')
    
    if (spinning) {
      console.log('Already spinning')
      return
    }

    console.log('Starting spin...')
    setSpinning(true)
    setWinner(null)

    // Spin for 3 seconds
    setTimeout(() => {
      const randomWinner = testNames[Math.floor(Math.random() * testNames.length)]
      setWinner(randomWinner)
      setSpinning(false)
      
      // Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      console.log('Spin completed! Winner:', randomWinner)
    }, 3000)
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8">🎰 CASINO WHEEL TEST 🎰</h1>
        
        {/* Simple spinning wheel */}
        <div className="relative mx-auto mb-8" style={{width: '300px', height: '300px'}}>
          <motion.div
            className="w-full h-full rounded-full border-8 border-yellow-400 bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
            animate={spinning ? { rotate: 1800 } : { rotate: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="text-white font-bold text-xl">
              {spinning ? '🎲' : '🎰'}
            </div>
          </motion.div>
        </div>

        {/* Spin button */}
        <button
          onClick={doSpin}
          disabled={spinning}
          className={`px-8 py-4 text-xl font-bold rounded-lg transition-all ${
            spinning 
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-yellow-500 text-black hover:bg-yellow-400 cursor-pointer'
          }`}
        >
          {spinning ? '🎲 SPINNING...' : '🎰 SPIN THE WHEEL'}
        </button>

        {/* Test button */}
        <button
          onClick={() => alert('Test button works!')}
          className="ml-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400"
        >
          🧪 TEST CLICK
        </button>

        {/* Winner display */}
        {winner && (
          <div className="mt-8 p-6 bg-green-600 text-white rounded-lg">
            <h2 className="text-2xl font-bold">🎉 WINNER! 🎉</h2>
            <p className="text-xl">{winner}</p>
          </div>
        )}

        {/* Debug info */}
        <div className="mt-8 p-4 bg-black/50 text-white rounded">
          <p>Spinning: {spinning.toString()}</p>
          <p>Winner: {winner || 'None'}</p>
          <p>Names: {testNames.length} loaded</p>
        </div>
      </div>
    </main>
  )
}