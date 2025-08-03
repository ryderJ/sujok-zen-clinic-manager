# Deployment Guide za admin.neutro.rs

## Priprema za deployment

### 1. Build aplikacije
```bash
npm run build
# ili
yarn build
```

### 2. Upload fajlova na VPS
Upload `dist` folder na VPS u folder `/var/www/admin.neutro.rs/`

### 3. Nginx konfiguracija
Kreiraj `/etc/nginx/sites-available/admin.neutro.rs`:

```nginx
server {
    listen 80;
    server_name admin.neutro.rs;
    
    root /var/www/admin.neutro.rs;
    index index.html;
    
    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4. Enable site
```bash
sudo ln -s /etc/nginx/sites-available/admin.neutro.rs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL certificate sa Let's Encrypt
```bash
sudo certbot --nginx -d admin.neutro.rs
```

## Login podatci

U `src/components/LocalLoginForm.tsx` promeni login podatke:

```typescript
const ADMIN_USERNAME = "your_username";
const ADMIN_PASSWORD = "your_password";
```

**VAŽNO**: Promeni default login podatke (`admin` / `neutro2024`) pre deployment-a!

## Čuvanje podataka

Aplikacija koristi **localStorage** u browser-u za čuvanje podataka:

- **Pacijenti**: localStorage key `sujok_patients`
- **Sesije**: localStorage key `sujok_sessions` 
- **Tretmani**: localStorage key `sujok_treatments` (sa slikama u base64 formatu)

### Backup podataka
Za backup podataka možeš eksportovati localStorage:
```javascript
// U browser console
const backup = {
  patients: localStorage.getItem('sujok_patients'),
  sessions: localStorage.getItem('sujok_sessions'),
  treatments: localStorage.getItem('sujok_treatments')
};
console.log(JSON.stringify(backup, null, 2));
```

### Restore podataka
```javascript
// U browser console
localStorage.setItem('sujok_patients', 'exported_data');
localStorage.setItem('sujok_sessions', 'exported_data');
localStorage.setItem('sujok_treatments', 'exported_data');
```

## DNS Setup

U DNS postavkama za neutro.rs dodaj:
```
A admin YOUR_VPS_IP_ADDRESS
```

## Monitoring

Za monitoring aplikacije možeš koristiti:
- `sudo tail -f /var/log/nginx/access.log`
- `sudo tail -f /var/log/nginx/error.log`