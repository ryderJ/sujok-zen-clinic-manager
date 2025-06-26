
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

### Opcija 1: Direktno pokretanje
```bash
# 1. Otvorite Terminal
# 2. Navigirajte do foldera sa projektom
cd putanja/do/therapy-manager

# 3. Instalirajte zavisnosti
npm install

# 4. Pokrenite aplikaciju
npm run electron-dev
```

### Opcija 2: Korišćenje script-a
```bash
# 1. Učinite script izvršnim
chmod +x start-electron.sh

# 2. Pokrenite script
./start-electron.sh
```

## 🔧 Kreiranje standalone .app fajla

Za kreiranje aplikacije koju možete instalirati na macOS:

```bash
# 1. Instalirajte zavisnosti (ako već niste)
npm install

# 2. Kreirajte produkcijsku verziju
npm run build

# 3. Kreirajte macOS aplikaciju
npm run electron-pack

# 4. Aplikacija će biti kreirana u dist/ folderu
# Možete je premestiti u Applications folder
```

## 📱 Korišćenje aplikacije

### Pokretanje
- **Development mod**: `npm run electron-dev`
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

## 🛠 Komandne skripte

```bash
# Pokretanje u development modu
npm run electron-dev

# Kreiranje produkcijske verzije
npm run build

# Kreiranje macOS aplikacije
npm run electron-pack

# Kreiranje DMG fajla za distribuciju
npm run electron-dist
```

## 🔍 Rešavanje problema

### Problem: "npm nije pronađen"
```bash
# Instalirajte Node.js sa https://nodejs.org
# Restartujte Terminal nakon instalacije
```

### Problem: "Aplikacija se ne pokretает"
```bash
# Obavezno instalirajte zavisnosti prvo
npm install

# Proverite da li je port 8080 slobodan
lsof -ti:8080 | xargs kill -9
```

### Problem: "Permission denied"
```bash
# Dajte dozvolu script-u
chmod +x start-electron.sh
```

## 📞 Podrška

Ako imate problema sa instalacijom:
1. Proverite da li imate najnoviju verziju Node.js
2. Obavezno pokrenite `npm install` pre prvog pokretanja
3. Restartujte Terminal ako se pojave greške

---

**Napomena**: Ova aplikacija radi potpuno offline i ne šalje nikakve podatke van vašeg računara.
