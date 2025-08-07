# Neutro Admin Panel - Lokalna instalacija za razvoj

## Automatska instalacija

### 1. Dodela dozvola za pokretanje skriptova
```bash
chmod +x install.sh
chmod +x start-dev.sh
```

### 2. Pokretanje automatske instalacije
```bash
./install.sh
```

Ova skripta će:
- Kreirati potrebne foldere (`server/data`, `server/data/uploads`, `server/data/backup`)
- Kreirati prazne JSON fajlove za bazu podataka
- Instalirati sve potrebne dependencije za frontend i backend
- Kreirati .env fajl za backend

### 3. Pokretanje aplikacije u dev modu
```bash
./start-dev.sh
```

Ili ručno u dva terminala:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Ručna instalacija (alternativa)

### 1. Kreiranje folder strukture
```bash
mkdir -p server/data/uploads
mkdir -p server/data/backup
```

### 2. Kreiranje osnovnih fajlova baze
```bash
echo "[]" > server/data/patients.json
echo "[]" > server/data/sessions.json
echo "[]" > server/data/treatments.json
echo "[]" > server/data/categories.json
```

### 3. Kreiranje .env fajla za server
```bash
cat > server/.env << EOF
PORT=3001
NODE_ENV=development
EOF
```

### 4. Instaliranje dependencija
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 5. Pokretanje
```bash
# Backend (prvi terminal)
cd server && npm start

# Frontend (drugi terminal)
npm run dev
```

## Pristup aplikaciji

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Login podaci**:
  - Korisničko ime: `admin`
  - Lozinka: `neutro2024`

## Struktura podataka

Svi podaci se čuvaju lokalno u `server/data/` folderu:
- `patients.json` - Podaci o pacijentima
- `sessions.json` - Terapijske sesije
- `treatments.json` - Tretmani
- `categories.json` - Kategorije tretmana
- `uploads/` - Folder za slike tretmana
- `backup/` - Folder za backup fajlove

## Zaustavljanje aplikacije

- Pritisni `Ctrl+C` u oba terminala
- Ili ako koristiš `start-dev.sh`, samo jedan `Ctrl+C` će zaustaviti oba servisa