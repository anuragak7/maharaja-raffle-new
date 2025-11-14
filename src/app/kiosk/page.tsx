'use client';

import { useState, useEffect } from 'react';

interface Entry {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  store: string;
}

interface Winner {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  store: string;
  wonAt: string;
}

export default function KioskPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [entriesRes, winnersRes] = await Promise.all([
        fetch('/api/entries?store=bellerose'),
        fetch('/api/winners?store=bellerose')
      ]);
      
      const entriesData = await entriesRes.json();
      const winnersData = await winnersRes.json();
      
      setEntries(entriesData);
      setWinners(winnersData);
      setTotalEntries(entriesData.length);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDraw = async () => {
    setIsDrawing(true);
    setShowWinner(false);
    
    try {
      const response = await fetch('/api/draw?store=bellerose', {
        method: 'POST',
      });
      
      if (response.ok) {
        const winner = await response.json();
        
        // Simulate drawing animation
        setTimeout(() => {
          setCurrentWinner(winner);
          setShowWinner(true);
          setIsDrawing(false);
          loadData(); // Refresh data
        }, 3000);
      }
    } catch (error) {
      console.error('Error drawing winner:', error);
      setIsDrawing(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
              MAHARAJA BELLEROSE
            </h1>
            <p className="text-3xl text-blue-200 mt-2 font-bold">Live Raffle Draw</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-mono text-yellow-300 font-bold">
              {formatTime(currentTime)}
            </div>
            <div className="text-2xl text-gray-300 mt-1">
              Total Participants: <span className="text-yellow-400 font-black text-3xl">{totalEntries}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          {isDrawing && (
            <div className="text-center">
              <div className="relative mb-12">
                <div className="w-48 h-48 border-12 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-12"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl">🎰</div>
                </div>
              </div>
              <h2 className="text-9xl font-black text-yellow-400 mb-8 animate-pulse drop-shadow-2xl">
                DRAWING...
              </h2>
              <p className="text-4xl text-blue-200 font-bold">
                Selecting a lucky winner from {totalEntries} participants
              </p>
            </div>
          )}

          {showWinner && currentWinner && (
            <div className="text-center animate-bounce">
              <div className="text-9xl mb-12">🎉</div>
              <h2 className="text-10xl font-black text-yellow-400 mb-10 animate-pulse drop-shadow-2xl">
                WINNER!
              </h2>
              <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-16 border-4 border-yellow-400/50 shadow-2xl">
                <h3 className="text-8xl font-black text-white mb-8 drop-shadow-lg">
                  {currentWinner.firstName} {currentWinner.lastName}
                </h3>
                <p className="text-5xl text-blue-200 mb-8 font-bold">
                  Phone: {currentWinner.phone}
                </p>
                <p className="text-3xl text-gray-300 font-semibold">
                  Won at: {new Date(currentWinner.wonAt).toLocaleString()}
                </p>
              </div>
              <div className="text-8xl mt-12">🏆</div>
            </div>
          )}

          {!isDrawing && !showWinner && (
            <div className="text-center">
              <div className="text-9xl mb-12">🎊</div>
              <h2 className="text-8xl font-black text-white mb-12 drop-shadow-2xl">
                READY FOR LUCKY DRAW
              </h2>
              <button
                onClick={handleDraw}
                disabled={totalEntries === 0}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 
                         disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
                         text-white text-5xl font-black py-10 px-24 rounded-3xl
                         transform transition-all duration-200 hover:scale-110 hover:shadow-2xl
                         border-8 border-yellow-300/50 shadow-2xl"
              >
                🎲 DRAW WINNER 🎲
              </button>
              {totalEntries === 0 && (
                <p className="text-red-400 text-3xl mt-8 font-bold">
                  No participants available for draw
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Recent Winners */}
        <div className="w-96 bg-black/20 backdrop-blur-sm border-l border-white/10 p-6 overflow-y-auto">
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            🏆 RECENT WINNERS
          </h3>
          
          {winners.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-lg">No winners yet!</p>
              <p className="text-sm mt-2">Be the first to win!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {winners.slice(0, 10).map((winner, index) => (
                <div
                  key={winner.id}
                  className={`p-4 rounded-xl border ${
                    index === 0
                      ? 'bg-yellow-500/20 border-yellow-400/50 shadow-lg'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">
                      {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎊'}
                    </span>
                    <span className="text-xs text-gray-400">
                      #{winners.length - index}
                    </span>
                  </div>
                  <div className={`font-bold ${index === 0 ? 'text-yellow-300 text-lg' : 'text-white'}`}>
                    {winner.firstName} {winner.lastName}
                  </div>
                  <div className="text-sm text-gray-300">
                    {winner.phone}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(winner.wonAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-black/30 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-center space-x-12 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400">{totalEntries}</div>
            <div className="text-sm text-gray-300">Total Participants</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{winners.length}</div>
            <div className="text-sm text-gray-300">Winners Drawn</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{Math.max(0, totalEntries - winners.length)}</div>
            <div className="text-sm text-gray-300">Remaining Entries</div>
          </div>
        </div>
      </div>
    </div>
  );
}