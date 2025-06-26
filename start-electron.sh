
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

# Pokretanje aplikacije
echo "✅ Pokretam aplicaciju..."
npm run electron-dev
