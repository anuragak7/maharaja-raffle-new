#!/bin/bash
cd "/Users/anuragkalakanti/Library/Mobile Documents/com~apple~CloudDocs/maharaja-lucky-draw-postgres"

echo "🚀 Starting Maharaja Raffle Server..."

# Kill any existing processes
pkill -f "next\|node" 2>/dev/null

# Start the server
npm run dev -- --hostname 0.0.0.0 --port 3000 &

# Wait for server to start
sleep 10

# Get IP address
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

echo ""
echo "🎰 MAHARAJA HICKSVILLE RAFFLE IS LIVE!"
echo ""
echo "📱 Open on your kiosk:"
echo "Admin Panel: http://$IP:3000/admin"
echo "Draw Page: http://$IP:3000/draw"
echo ""
echo "🔐 Password: admin123secure"
echo ""
echo "✅ Server running on port 3000"
echo ""

# Keep the script running
wait