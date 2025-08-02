# Su Jok Therapy Manager 🌿

Profesionalna web aplikacija za upravljanje Su Jok terapeutskom praksom.

## ✨ Funkcionalnosti

- 👥 **Upravljanje pacijentima** - dodavanje, uređivanje, deaktiviranje
- 📅 **Zakazivanje terapija** - kalendar sesija sa različitim statusima
- 🩺 **Istorija tretmana** - detaljno praćenje tretmana
- 📊 **Statistike** - pregled performansi prakse
- 📄 **PDF izvoz** - kompletni izveštaji o pacijentima
- ✏️ **Uređivanje sesija** - mogućnost izmene završenih sesija
- 💾 **Lokalno čuvanje** - svi podaci se čuvaju lokalno u pregledniku
- 🔄 **Real-time ažuriranje** - automatsko ažuriranje UI-ja

## 🌐 Deployment na VPS (admin.neutro.rs)

Za deployment na Ubuntu 22 VPS:

```bash
# Build aplikaciju
npm run build

# Kopiraj dist folder na server
scp -r dist/* user@admin.neutro.rs:/var/www/html/

# Ili koristi nginx za servisiranje
sudo systemctl start nginx
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/df0bfa58-72e1-4394-a5bf-397bfc6f2320) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🏗️ Tehnički stek

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn-ui
- **Icons**: Lucide React
- **PDF**: jsPDF + html2canvas
- **Build**: Vite
- **Routing**: React Router DOM

## 📱 Ključne komponente

- `PatientProfile` - detaljni profil pacijenta sa PDF export
- `PDFExport` - izvoz podataka u PDF format
- `EditSessionForm` - uređivanje sesija i tretmana
- `TherapyCalendar` - kalendar terapija
- `DashboardStats` - statistike prakse

## 💡 Napomene

- Podaci se čuvaju u localStorage preglednika
- Aplikacija radi potpuno offline
- Real-time ažuriranje preko storage events
- Responzivni dizajn za sve uređaje

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/df0bfa58-72e1-4394-a5bf-397bfc6f2320) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
