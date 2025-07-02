
#!/bin/bash

echo "🚀 Pokretanje Su Jok Therapy Manager aplikacije..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js nije instaliran. Molimo instalirajte Node.js sa https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm nije instaliran. Molimo instalirajte npm."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Instaliram zavisnosti..."
    npm install
fi

echo "🔧 Pokretam Vite dev server..."
npm run dev &
VITE_PID=$!

echo "⏳ Čekam da se dev server pokrene..."
sleep 5

echo "✅ Pokretam Electron aplikaciju..."
NODE_ENV=development npx electron electron/main.js

kill $VITE_PID 2>/dev/null
