
#!/bin/bash

echo "🚀 Pokretanje Su Jok Therapy Manager aplikacije..."

# Proverava da li je Node.js instaliran
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nije instaliran. Molimo instalirajte Node.js sa https://nodejs.org"
    exit 1
fi

# Proverava da li je npm instaliran
if ! command -v npm &> /dev/null; then
    echo "❌ npm nije instaliran. Molimo instalirajte npm."
    exit 1
fi

# Instalira zavisnosti ako node_modules ne postoji
if [ ! -d "node_modules" ]; then
    echo "📦 Instaliram zavisnosti..."
    npm install
fi

# Pokretanje Vite dev servera u pozadini
echo "🔧 Pokretam Vite dev server..."
npm run dev &
VITE_PID=$!

# Čeka da se Vite server pokrene
echo "⏳ Čekam da se dev server pokrene..."
npx wait-on http://localhost:8080

# Pokretanje Electron aplikacije
echo "✅ Pokretam Electron aplikaciju..."
NODE_ENV=development npx electron public/electron.js

# Zatvaranje Vite servera kada se Electron zatvori
kill $VITE_PID 2>/dev/null
