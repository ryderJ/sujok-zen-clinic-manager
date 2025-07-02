
# 🏥 Su Jok Therapy Manager - Uputstvo za instalaciju

## 📋 Preduslovi

1. **Node.js** (LTS verzija)
   - Idite na https://nodejs.org
   - Preuzmite i instalirajte LTS verziju
   - Verifikujte: `node --version`

## 🚀 Najlakši način pokretanja

```bash
# 1. Otvorite Terminal i idite u folder sa projektom
cd putanja/do/therapy-manager

# 2. Učinite script izvršnim
chmod +x start-electron.sh

# 3. Pokrenite aplikaciju
./start-electron.sh
```

## 🔧 Manuelno pokretanje

```bash
# 1. Instalirajte zavisnosti
npm install

# 2. U jednom terminalu pokrenite dev server
npm run dev

# 3. U drugom terminalu pokrenite Electron
NODE_ENV=development npx electron main.js
```

## 📱 Korišćenje

- Potpuno offline rad
- Lokalno čuvanje podataka
- Upravljanje pacijentima
- Zakazivanje terapija
- Praćenje tretmana

## 🛠 Rešavanje problema

### "npm nije pronađen"
```bash
# Instalirajte Node.js sa https://nodejs.org
# Restartujte Terminal
```

### "Permission denied"
```bash
chmod +x start-electron.sh
```

### Aplikacija se ne pokretává
```bash
# Obavezno koristite npm (ne bun)
rm -rf node_modules
npm install
./start-electron.sh
```

---
**Napomena**: Aplikacija radi potpuno offline i ne šalje podatke van vašeg računara.
