#!/bin/bash

echo "🔧 Neutro Admin Panel - Automatska instalacija"
echo "=============================================="

# Kreiranje folder strukture za bazu podataka
echo "📁 Kreiranje folder strukture..."
mkdir -p server/data/uploads
mkdir -p server/data/backup

# Kreiranje praznih JSON fajlova
echo "📄 Kreiranje osnovnih fajlova baze..."
echo "[]" > server/data/patients.json
echo "[]" > server/data/sessions.json
echo "[]" > server/data/treatments.json
echo "[]" > server/data/categories.json

# Kreiranje .env fajla za server
echo "⚙️  Kreiranje konfiguracije..."
cat > server/.env << EOF
PORT=3001
NODE_ENV=development
EOF

# Instaliranje dependencija za frontend
echo "📦 Instaliranje frontend dependencija..."
npm install

# Prelazak u server folder i instaliranje dependencija
echo "📦 Instaliranje backend dependencija..."
cd server
npm install

echo ""
echo "✅ Instalacija završena!"
echo ""
echo "🚀 Za pokretanje aplikacije:"
echo "   1. Pokretanje backend servera:"
echo "      cd server && npm start"
echo ""
echo "   2. U novom terminalu, pokretanje frontend-a:"
echo "      npm run dev"
echo ""
echo "📌 Backend će biti dostupan na: http://localhost:3001"
echo "📌 Frontend će biti dostupan na: http://localhost:5173"
echo ""
echo "🔐 Login podaci:"
echo "   Korisničko ime: admin"
echo "   Lozinka: neutro2024"