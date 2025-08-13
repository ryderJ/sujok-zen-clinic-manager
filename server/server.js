const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data folder setup
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure directories exist
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(UPLOADS_DIR);

// File paths
const FILES = {
  patients: path.join(DATA_DIR, 'patients.json'),
  sessions: path.join(DATA_DIR, 'sessions.json'),
  treatments: path.join(DATA_DIR, 'treatments.json'),
  categories: path.join(DATA_DIR, 'categories.json')
};

// Initialize files if they don't exist
Object.values(FILES).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeJsonSync(file, []);
  }
});

// Notifications tracking file setup (outside server folder to avoid nodemon restarts)
const NOTIFICATIONS_DIR = path.join(__dirname, '..', 'local-data');
fs.ensureDirSync(NOTIFICATIONS_DIR);
const NOTIFICATIONS_FILE = path.join(NOTIFICATIONS_DIR, 'notifications.json');
if (!fs.existsSync(NOTIFICATIONS_FILE)) {
  fs.writeJsonSync(NOTIFICATIONS_FILE, { notified15: {} }, { spaces: 2 });
}

// Helper functions
const readData = (type) => {
  try {
    return fs.readJsonSync(FILES[type]);
  } catch (error) {
    console.error(`Error reading ${type}:`, error);
    return [];
  }
};

const writeData = (type, data) => {
  try {
    fs.writeJsonSync(FILES[type], data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Error writing ${type}:`, error);
    return false;
  }
};

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// PATIENTS ROUTES
app.get('/api/patients', (req, res) => {
  const patients = readData('patients');
  res.json(patients);
});

app.post('/api/patients', (req, res) => {
  const patients = readData('patients');
  const newPatient = {
    ...req.body,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  patients.push(newPatient);
  
  if (writeData('patients', patients)) {
    res.json(newPatient);
  } else {
    res.status(500).json({ error: 'Failed to save patient' });
  }
});

app.put('/api/patients/:id', (req, res) => {
  const patients = readData('patients');
  const index = patients.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  patients[index] = { ...patients[index], ...req.body };
  
  if (writeData('patients', patients)) {
    res.json(patients[index]);
  } else {
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

app.delete('/api/patients/:id', (req, res) => {
  const patients = readData('patients');
  const sessions = readData('sessions');
  const treatments = readData('treatments');
  
  const filteredPatients = patients.filter(p => p.id !== req.params.id);
  const filteredSessions = sessions.filter(s => s.patient_id !== req.params.id);
  const filteredTreatments = treatments.filter(t => t.patient_id !== req.params.id);
  
  if (writeData('patients', filteredPatients) && 
      writeData('sessions', filteredSessions) && 
      writeData('treatments', filteredTreatments)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

// SESSIONS ROUTES
app.get('/api/sessions', (req, res) => {
  const sessions = readData('sessions');
  res.json(sessions);
});

app.post('/api/sessions', (req, res) => {
  const sessions = readData('sessions');
  const newSession = {
    ...req.body,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  sessions.push(newSession);
  
  if (writeData('sessions', sessions)) {
    res.json(newSession);
  } else {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

app.put('/api/sessions/:id', (req, res) => {
  const sessions = readData('sessions');
  const index = sessions.findIndex(s => s.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  sessions[index] = { ...sessions[index], ...req.body };
  
  if (writeData('sessions', sessions)) {
    res.json(sessions[index]);
  } else {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

app.delete('/api/sessions/:id', (req, res) => {
  const sessions = readData('sessions');
  const filteredSessions = sessions.filter(s => s.id !== req.params.id);
  
  if (writeData('sessions', filteredSessions)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// TREATMENTS ROUTES
app.get('/api/treatments', (req, res) => {
  const treatments = readData('treatments');
  res.json(treatments);
});

app.post('/api/treatments', upload.array('images', 10), (req, res) => {
  const treatments = readData('treatments');

  // Collect images from either uploaded files (preferred) or JSON body (base64/data URLs)
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map(file => `/uploads/${file.filename}`);
  } else if (Array.isArray(req.body.images)) {
    images = req.body.images;
  } else if (typeof req.body.images === 'string' && req.body.images.trim()) {
    images = [req.body.images];
  }

  const newTreatment = {
    ...req.body,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    images
  };

  treatments.push(newTreatment);

  if (writeData('treatments', treatments)) {
    res.json(newTreatment);
  } else {
    res.status(500).json({ error: 'Failed to save treatment' });
  }
});

// Update treatment (JSON fields). To update images, use the creation route or a dedicated upload route.
app.put('/api/treatments/:id', (req, res) => {
  const treatments = readData('treatments');
  const index = treatments.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Treatment not found' });
  }

  const updates = { ...req.body };
  // Preserve existing images unless explicitly provided
  const images = updates.images !== undefined ? updates.images : treatments[index].images;
  treatments[index] = { ...treatments[index], ...updates, images };

  if (writeData('treatments', treatments)) {
    res.json(treatments[index]);
  } else {
    res.status(500).json({ error: 'Failed to update treatment' });
  }
});

app.delete('/api/treatments/:id', (req, res) => {
  const treatments = readData('treatments');
  const filteredTreatments = treatments.filter(t => t.id !== req.params.id);
  
  if (writeData('treatments', filteredTreatments)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete treatment' });
  }
});

// CATEGORIES ROUTES
app.get('/api/categories', (req, res) => {
  const categories = readData('categories');
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const categories = readData('categories');
  const newCategory = {
    ...req.body,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  categories.push(newCategory);
  
  if (writeData('categories', categories)) {
    res.json(newCategory);
  } else {
    res.status(500).json({ error: 'Failed to save category' });
  }
});

app.put('/api/categories/:id', (req, res) => {
  const categories = readData('categories');
  const index = categories.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  categories[index] = { ...categories[index], ...req.body };
  
  if (writeData('categories', categories)) {
    res.json(categories[index]);
  } else {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  const categories = readData('categories');
  const filteredCategories = categories.filter(c => c.id !== req.params.id);
  
  if (writeData('categories', filteredCategories)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// BACKUP ROUTES
app.get('/api/backup', (req, res) => {
  try {
    const backup = {
      patients: readData('patients'),
      sessions: readData('sessions'),
      treatments: readData('treatments'),
      categories: readData('categories'),
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    res.json(backup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

app.post('/api/restore', (req, res) => {
  try {
    const { patients, sessions, treatments, categories } = req.body;
    
    if (writeData('patients', patients || []) &&
        writeData('sessions', sessions || []) &&
        writeData('treatments', treatments || []) &&
        writeData('categories', categories || [])) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to restore data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore data' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Telegram notifications (15 minutes before session)
const TELEGRAM_BOT_TOKEN = '8000994045:AAH6kef05FWDU6SSsYbADt4l4EBw1MpeLAc';
const TELEGRAM_CHAT_ID = '-4863878743';

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch {}
        const ok = res.statusCode === 200 && json && json.ok === true;
        if (!ok) {
          console.error('Telegram API error:', { status: res.statusCode, body: body });
        }
        resolve({ ok, status: res.statusCode, body: json || body });
      });
    });
    req.on('error', (err) => {
      console.error('Telegram request error:', err);
      reject(err);
    });
    req.write(payload);
    req.end();
  });
}

function parseSessionDateTime(session) {
  const [y, m, d] = String(session.date || '').split('-').map((n) => parseInt(n, 10));
  const [hh, mm] = String(session.time || '').split(':').map((n) => parseInt(n, 10));
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function formatMessage(session, patientName) {
  const dateStr = `${session.date} ${session.time}`;
  const lines = [
    `Podsetnik: terapija za ${patientName} za 15 minuta.`,
    `Termin: ${dateStr}`,
  ];
  if (session.notes) lines.push(`Napomena: ${session.notes}`);
  return lines.join('\n');
}

function loadNotifications() {
  try {
    return fs.readJsonSync(NOTIFICATIONS_FILE);
  } catch {
    return { notified15: {} };
  }
}

function saveNotifications(data) {
  try {
    fs.writeJsonSync(NOTIFICATIONS_FILE, data, { spaces: 2 });
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

async function checkAndNotifySessions() {
  try {
    const sessions = readData('sessions');
    const patients = readData('patients');
    const patientMap = new Map(patients.map((p) => [p.id, p.name]));
    const notif = loadNotifications();
    const now = Date.now();
    let changed = false;

    for (const s of sessions) {
      const start = parseSessionDateTime(s);
      if (!start) continue;

      const diff = start.getTime() - now; // milliseconds until session
      if (diff <= 15 * 60 * 1000 && diff > 0) {
        const status = String(s.status || '').toLowerCase();
        if (status === 'cancelled' || status === 'otkazano') continue;
        if (notif.notified15[s.id]) continue;

        const patientName = patientMap.get(s.patient_id) || 'Nepoznat pacijent';
        const text = formatMessage(s, patientName);
        try {
          const result = await sendTelegramMessage(text);
          if (result.ok) {
            notif.notified15[s.id] = true;
            changed = true;
          } else {
            console.error('Telegram send failed:', result);
          }
        } catch (err) {
          console.error('Telegram request error:', err);
        }
        }
      }

    if (changed) saveNotifications(notif);
  } catch (err) {
    console.error('checkAndNotifySessions error:', err);
  }
}

// Run every minute
setInterval(checkAndNotifySessions, 60 * 1000);
// Initial check on startup
checkAndNotifySessions();

app.listen(PORT, () => {
  console.log(`Neutro Admin Backend server running on port ${PORT}`);
});