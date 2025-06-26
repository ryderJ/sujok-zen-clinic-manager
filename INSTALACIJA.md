
# 🏥 Su Jok Therapy Manager - Uputstvo za instalaciju na macOS

## 📋 Preduslovi

1. **Node.js** (preporučena LTS verzija)
   - Idite na https://nodejs.org
   - Preuzmite i instalirajte LTS verziju
   - Verifikujte instalaciju: otvorite Terminal i ukucajte `node --version`

2. **Git** (opciono, ako klonirate projekat)
   - Instalirajte Xcode Command Line Tools: `xcode-select --install`
   - Ili preuzmite sa https://git-scm.com

## 🚀 Brza instalacija

### Opcija 1: Korišćenje automatskog script-a (PREPORUČENO)
```bash
# 1. Otvorite Terminal
# 2. Navigirajte do foldera sa projektom
cd putanja/do/therapy-manager

# 3. Učinite script izvršnim
chmod +x start-electron.sh

# 4. Pokrenite aplikaciju jednom komandom
./start-electron.sh
```

### Opcija 2: Manuelno pokretanje
```bash
# 1. Instalirajte zavisnosti (koristite npm umesto bun zbog Electron kompatibilnosti)
npm install

# 2. U jednom terminalu pokrenite dev server
npm run dev

# 3. U drugom terminalu pokrenite Electron (kada se dev server pokrene)
npx wait-on http://localhost:8080 && NODE_ENV=development npx electron public/electron.js
```

### Opcija 3: Direktno pokretanje Electron-a
```bash
# 1. Instalirajte zavisnosti
npm install

# 2. Direktno pokrenite Electron aplikaciju
NODE_ENV=development npx electron public/electron.js
```

## 🔧 Kreiranje standalone .app fajla

Za kreiranje aplikacije koju možete instalirati na macOS:

```bash
# 1. Instalirajte zavisnosti (koristite npm)
npm install

# 2. Kreirajte produkcijsku verziju
npm run build

# 3. Kreirajte macOS aplikaciju
npx electron-builder --mac

# 4. Aplikacija će biti kreirana u dist/ folderu
# Možete je premestiti u Applications folder
```

## 📱 Korišćenje aplikacije

### Pokretanje
- **Najlakši način**: `./start-electron.sh`
- **Development mod**: `npm run dev` + `npx electron public/electron.js`
- **Produkcijska verzija**: Dvoklikom na .app fajl

### Funkcionalnosti
- ✅ Potpuno offline rad
- ✅ Lokalno čuvanje podataka
- ✅ Upravljanje pacijentima
- ✅ Zakazivanje terapija
- ✅ Praćenje tretmana
- ✅ Statistike i izveštaji

### Čuvanje podataka
- Svi podaci se čuvaju lokalno na vašem Mac-u
- Lokacija: `~/Library/Application Support/Su Jok Therapy Manager/`
- Automatski backup pri svakom unosu

## 🛠 Dostupne komande

```bash
# Pokretanje aplikacije (automatski script)
./start-electron.sh

# Pokretanje dev servera
npm run dev

# Kreiranje produkcijske verzije
npm run build

# Direktno pokretanje Electron-a
npx electron public/electron.js

# Kreiranje macOS aplikacije
npx electron-builder --mac

# Kreiranje DMG fajla za distribuciju
npx electron-builder --mac --publish=never
```

## 🔍 Rešavanje problema

### Problem: "npm nije pronađen"
```bash
# Instalirajte Node.js sa https://nodejs.org
# Restartujte Terminal nakon instalacije
```

### Problem: "Aplikacija se ne pokretается"
```bash
# Obavezno instalirajte zavisnosti prvo sa npm (ne sa bun)
npm install

# Proverite da li je port 8080 slobodan
lsof -ti:8080 | xargs kill -9

# Pokušajte sa automatskim script-om
chmod +x start-electron.sh
./start-electron.sh
```

### Problem: "Permission denied"
```bash
# Dajte dozvolu script-u
chmod +x start-electron.sh
```

### Problem: "Electron installation failed"
```bash
# Koristite npm umesto bun za Electron projekte
rm -rf node_modules
npm install
```

### Problem: "Missing script"
```bash
# Koristite direktne komande umesto npm run
npx electron public/electron.js

# Ili koristite automatski script
./start-electron.sh
```

## 📞 Podrška

Ako imate problema sa instalacijom:
1. Proverite da li imate najnoviju verziju Node.js
2. Obavezno pokrenite `npm install` (ne `bun install`) pre prvog pokretanja
3. Koristite `./start-electron.sh` za najlakše pokretanje
4. Restartujte Terminal ako se pojave greške
5. Za Electron projekte uvek koristite npm

---

**Napomena**: Ova aplikacija radi potpuno offline i ne šalje nikakve podatke van vašeg računara.
