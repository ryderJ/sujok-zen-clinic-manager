# Deployment Guide za admin.neutro.rs

## Priprema za deployment

### 1. Backend setup

Prvo postavi Node.js backend na VPS-u:

```bash
# Install Node.js i npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Kreiraj direktorij za backend
sudo mkdir -p /var/www/neutro-admin-backend
cd /var/www/neutro-admin-backend

# Upload server fajlove (server/ folder iz projekta)
# Instaliraj dependencies
npm install

# Instaliraj PM2 za upravljanje procesom
sudo npm install -g pm2

# Pokreni backend
pm2 start server.js --name "neutro-admin-backend"
pm2 startup
pm2 save
```

### 2. Build aplikacije

**IMPORTANT**: Promeni API_BASE_URL u `src/lib/database.ts` sa:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```
na:
```typescript
const API_BASE_URL = 'https://admin.neutro.rs/api';
```

Zatim build aplikaciju:
```bash
npm run build
# ili
yarn build
```

### 3. Upload fajlova na VPS
Upload `dist` folder na VPS u folder `/var/www/admin.neutro.rs/`

### 4. Apache konfiguracija

Kreiraj `/etc/apache2/sites-available/admin.neutro.rs.conf`:

```apache
<VirtualHost *:80>
    ServerName admin.neutro.rs
    DocumentRoot /var/www/admin.neutro.rs
    
    # React Router support
    <Directory "/var/www/admin.neutro.rs">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Proxy API calls to backend
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:3001/api/
    ProxyPassReverse /api/ http://localhost:3001/api/
    ProxyPass /uploads/ http://localhost:3001/uploads/
    ProxyPassReverse /uploads/ http://localhost:3001/uploads/
    
    # Cache static assets
    <LocationMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header append Cache-Control "public"
    </LocationMatch>
    
    ErrorLog ${APACHE_LOG_DIR}/admin.neutro.rs_error.log
    CustomLog ${APACHE_LOG_DIR}/admin.neutro.rs_access.log combined
</VirtualHost>
```

### 5. Enable site i moduli
```bash
# Enable potrebne Apache module
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod expires
sudo a2enmod headers

# Enable site
sudo a2ensite admin.neutro.rs.conf
sudo systemctl reload apache2
```

### 6. SSL certificate sa Let's Encrypt
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d admin.neutro.rs
```

## Login podatci

U `src/components/LocalLoginForm.tsx` promeni login podatke:

```typescript
const ADMIN_USERNAME = "your_username";
const ADMIN_PASSWORD = "your_password";
```

**VAŽNO**: Promeni default login podatke (`admin` / `neutro2024`) pre deployment-a!

## Čuvanje podataka

Aplikacija koristi **Node.js backend** koji čuva podatke u JSON fajlovima na VPS-u:

### Struktura podataka na serveru:
```
/var/www/neutro-admin-backend/
├── data/
│   ├── patients.json      # Podaci o pacijentima
│   ├── sessions.json      # Terapijske sesije
│   ├── treatments.json    # Tretmani
│   └── categories.json    # Kategorije tretmana
├── uploads/               # Upload-ovane slike
└── server.js             # Backend server
```

### Backup i restore
Aplikacija ima ugrađenu **Backup Manager** stranicu gdje možeš:
- **Eksportovati** sve podatke u JSON fajl 
- **Importovati** prethodno eksportovane podatke
- **Obrisati** sve podatke iz sistema

### Manuelni backup
Za backup direktno sa servera:
```bash
cd /var/www/neutro-admin-backend
tar -czf backup-$(date +%Y%m%d).tar.gz data/ uploads/
```

### Restore podataka
```bash
cd /var/www/neutro-admin-backend
tar -xzf backup-20231225.tar.gz
pm2 restart neutro-admin-backend
```

## DNS Setup

U DNS postavkama za neutro.rs dodaj:
```
A admin YOUR_VPS_IP_ADDRESS
```

## Monitoring

Za monitoring aplikacije možeš koristiti:

### Frontend (Apache)
- `sudo tail -f /var/log/apache2/admin.neutro.rs_access.log`
- `sudo tail -f /var/log/apache2/admin.neutro.rs_error.log`

### Backend (PM2)
- `pm2 logs neutro-admin-backend`
- `pm2 monit`
- `pm2 status`

### Restartovanje servisa
```bash
# Restart backend
pm2 restart neutro-admin-backend

# Restart Apache
sudo systemctl restart apache2
```