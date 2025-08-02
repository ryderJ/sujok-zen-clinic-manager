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

## Environment variables

Kreiraj `.env` fajl u root direktoru:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup (Supabase)

### 1. Kreiranje tabela u Supabase:

```sql
-- Pacijenti tabela
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  date_of_birth DATE NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sesije tabela
CREATE TABLE therapy_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR CHECK (status IN ('zakazana', 'odrađena', 'otkazana')) DEFAULT 'zakazana',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tretmani tabela
CREATE TABLE treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type VARCHAR NOT NULL,
  description TEXT NOT NULL,
  images TEXT[], -- Array za base64 slike
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 2. Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

-- Policies za autentifikovane korisnike
CREATE POLICY "Allow authenticated users all operations" ON patients FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users all operations" ON therapy_sessions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users all operations" ON treatments FOR ALL TO authenticated USING (true);
```

## Autentifikacija

1. U Supabase dashboard, idi na Authentication > Users
2. Kreiraj korisnika sa email/password
3. Koristi te podatke za login u aplikaciju

## Čuvanje podataka

Aplikacija koristi **Supabase PostgreSQL bazu** umesto localStorage:

- **Pacijenti**: Tabela `patients`
- **Sesije**: Tabela `therapy_sessions` 
- **Tretmani**: Tabela `treatments` (sa slikama u base64 formatu)

Svi podatci su čuvani sigurno u cloud bazi sa backup sistemom.

## DNS Setup

U DNS postavkama za neutro.rs dodaj:
```
A admin YOUR_VPS_IP_ADDRESS
```

## Monitoring

Za monitoring aplikacije možeš koristiti:
- `sudo tail -f /var/log/nginx/access.log`
- `sudo tail -f /var/log/nginx/error.log`