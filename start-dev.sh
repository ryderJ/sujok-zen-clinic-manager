#!/bin/bash

echo "🚀 Pokretanje Neutro Admin Panel u dev modu..."

# Pokretanje backend servera u background
echo "📡 Pokretanje backend servera..."
cd server && npm start &
BACKEND_PID=$!

# Čekanje da se backend pokrene
sleep 3

# Povratak u root i pokretanje frontend
echo "🎨 Pokretanje frontend aplikacije..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Aplikacija je pokrenuta!"
echo "📌 Backend: http://localhost:3001"
echo "📌 Frontend: http://localhost:5173"
echo ""
echo "🛑 Za zaustavljanje, pritisnite Ctrl+C"

# Čekanje za Ctrl+C
trap "echo '🛑 Zaustavljanje servisa...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait