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
const BACKUPS_DIR = path.join(__dirname, 'backups');

// Ensure directories exist
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureDirSync(BACKUPS_DIR);

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

// Notifications: switched to in-memory scheduler (no file writes to avoid nodemon restarts)

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
    try {
      scheduleNotificationForSession(newSession);
    } catch (e) {
      console.error('Failed to schedule notification:', e);
    }
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
  const updatedSession = sessions[index];
  
  if (writeData('sessions', sessions)) {
    try {
      cancelScheduledNotification(updatedSession.id);
      scheduleNotificationForSession(updatedSession);
    } catch (e) {
      console.error('Failed to reschedule notification:', e);
    }
    res.json(updatedSession);
  } else {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

app.delete('/api/sessions/:id', (req, res) => {
  try {
    cancelScheduledNotification(req.params.id);
  } catch (e) {
    console.error('Failed to cancel scheduled notification:', e);
  }
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

// BACKUP ROUTES AND SCHEDULER
function buildBackup() {
  return {
    patients: readData('patients'),
    sessions: readData('sessions'),
    treatments: readData('treatments'),
    categories: readData('categories'),
    exportDate: new Date().toISOString(),
    version: '1.0',
  };
}

function saveBackupToFile() {
  const backup = buildBackup();
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${ts}.json`;
  const fullPath = path.join(BACKUPS_DIR, filename);
  fs.writeJsonSync(fullPath, backup, { spaces: 2 });
  return { filename, fullPath, backup };
}

function listBackupFiles() {
  try {
    const files = fs.readdirSync(BACKUPS_DIR).filter((n) => n.endsWith('.json'));
    const items = files.map((name) => {
      const stat = fs.statSync(path.join(BACKUPS_DIR, name));
      return {
        name,
        size: stat.size,
        createdAt: stat.mtime.toISOString(),
      };
    });
    // newest first
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (e) {
    console.error('Failed to list backups:', e);
    return [];
  }
}

function scheduleDailyBackup() {
  const run = () => {
    try {
      const { filename } = saveBackupToFile();
      console.log('Daily backup saved:', filename);
    } catch (e) {
      console.error('Daily backup failed:', e);
    }
  };

  const now = new Date();
  const next = new Date();
  next.setHours(2, 0, 0, 0); // 02:00 local time
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next.getTime() - now.getTime();
  setTimeout(() => {
    run();
    setInterval(run, 24 * 60 * 60 * 1000);
  }, delay);
}

// Start backup scheduler
scheduleDailyBackup();

// Manual backup (also persists to file)
app.get('/api/backup', (req, res) => {
  try {
    const { backup, filename } = saveBackupToFile();
    res.json({ ...backup, file: filename });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// List backups
app.get('/api/backups', (req, res) => {
  try {
    res.json(listBackupFiles());
  } catch (e) {
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

// Restore by uploaded JSON (compat)
app.post('/api/restore', (req, res) => {
  try {
    const { patients, sessions, treatments, categories } = req.body;

    if (
      writeData('patients', patients || []) &&
      writeData('sessions', sessions || []) &&
      writeData('treatments', treatments || []) &&
      writeData('categories', categories || [])
    ) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to restore data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore data' });
  }
});

// Restore by server-stored backup name
app.post('/api/backups/restore', (req, res) => {
  try {
    const name = String(req.body.name || '');
    if (!name || !name.endsWith('.json')) {
      return res.status(400).json({ error: 'Invalid backup name' });
    }
    const fullPath = path.join(BACKUPS_DIR, path.basename(name));
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Backup not found' });
    }
    const data = fs.readJsonSync(fullPath);
    const { patients, sessions, treatments, categories } = data;

    if (
      writeData('patients', patients || []) &&
      writeData('sessions', sessions || []) &&
      writeData('treatments', treatments || []) &&
      writeData('categories', categories || [])
    ) {
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
const TELEGRAM_CHAT_ID = '-1002836584138';
let DEFAULT_CHAT_ID = TELEGRAM_CHAT_ID;

function sendTelegramMessage(text, chatId = DEFAULT_CHAT_ID) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: chatId,
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
          // Handle migration to supergroup chat id automatically
          const migrateTo = json && json.parameters && json.parameters.migrate_to_chat_id;
          if (migrateTo) {
            console.warn('Telegram chat migrated. Updating DEFAULT_CHAT_ID and retrying with:', migrateTo);
            DEFAULT_CHAT_ID = String(migrateTo);
            // Retry once with the migrated chat id
            sendTelegramMessage(text, DEFAULT_CHAT_ID)
              .then(resolve)
              .catch(reject);
            return;
          }
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
  const rawDate = String(session.date || '').trim();
  const rawTime = String(session.time || '').trim();
  if (!rawDate) return null;

  // Try direct parse for ISO-like strings (e.g., "YYYY-MM-DDTHH:mm")
  if (rawDate.includes('T') || rawDate.includes(' ')) {
    const dt = new Date(rawDate);
    if (!isNaN(dt.getTime())) return dt;
  }

  // Fallback to separate fields (date + time)
  const [y, m, d] = rawDate.split('-').map((n) => parseInt(n, 10));
  const [hh, mm] = rawTime ? rawTime.split(':').map((n) => parseInt(n, 10)) : [NaN, NaN];
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function formatMessage(session, patientName) {
  const dt = parseSessionDateTime(session);
  const when = dt
    ? dt.toLocaleString('sr-RS', { dateStyle: 'medium', timeStyle: 'short' })
    : String(session.date || '').replace('T', ' ');
  const lines = [
    `Podsetnik: terapija za ${patientName} za 15 minuta.`,
    `Termin: ${when}`,
  ];
  if (session.notes) lines.push(`Napomena: ${session.notes}`);
  return lines.join('\n');
}

// In-memory scheduler for Telegram notifications
const scheduledJobs = new Map();
const SCHEDULE_AHEAD_MS = 15 * 60 * 1000;

async function sendNotificationForSession(session) {
  try {
    const patients = readData('patients');
    const patientName =
      (patients.find((p) => p.id === session.patient_id)?.name) || 'Nepoznat pacijent';
    const text = formatMessage(session, patientName);
    const result = await sendTelegramMessage(text);
    if (!result.ok) {
      console.error('Telegram send failed:', result);
      throw new Error('Telegram send failed');
    }
    return result;
  } catch (err) {
    console.error('sendNotificationForSession error:', err);
    throw err;
  }
}

function cancelScheduledNotification(sessionId) {
  const t = scheduledJobs.get(sessionId);
  if (t) {
    clearTimeout(t);
    scheduledJobs.delete(sessionId);
  }
}

function scheduleNotificationForSession(session) {
  try {
    if (!session || !session.id) return;
    cancelScheduledNotification(session.id);
    const start = parseSessionDateTime(session);
    if (!start) return;
    const now = Date.now();
    const status = String(session.status || '').toLowerCase();
    if (status === 'cancelled' || status === 'otkazano') return;

    const sendAt = start.getTime() - SCHEDULE_AHEAD_MS;
    const delay = sendAt - now;

    if (start.getTime() <= now) return;

    const timer = setTimeout(async () => {
      try {
        await sendNotificationForSession(session);
      } catch (e) {
        // already logged
      } finally {
        scheduledJobs.delete(session.id);
      }
    }, Math.max(0, delay));

    scheduledJobs.set(session.id, timer);
  } catch (e) {
    console.error('scheduleNotificationForSession error:', e);
  }
}

function scheduleAllExistingSessions() {
  try {
    const sessions = readData('sessions');
    sessions.forEach((s) => scheduleNotificationForSession(s));
  } catch (e) {
    console.error('scheduleAllExistingSessions error:', e);
  }
}

// Schedule on startup
scheduleAllExistingSessions();

// Telegram debug endpoints
app.get('/api/telegram/test', async (req, res) => {
  try {
    const text = String(req.query.text || 'Test poruka iz servera (manualni test)');
    const chatId = String(req.query.chat_id || TELEGRAM_CHAT_ID);
    const result = await sendTelegramMessage(text, chatId);
    res.json({ ok: result.ok, status: result.status, body: result.body, chatId });
  } catch (e) {
    console.error('Telegram test error:', e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.get('/api/telegram/updates', (req, res) => {
  const offset = req.query.offset ? `?offset=${encodeURIComponent(String(req.query.offset))}` : '';
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${TELEGRAM_BOT_TOKEN}/getUpdates${offset}`,
    method: 'GET',
  };
  const r = https.request(options, (tgRes) => {
    let body = '';
    tgRes.on('data', (d) => (body += d));
    tgRes.on('end', () => {
      try {
        const json = JSON.parse(body);
        res.status(tgRes.statusCode || 200).json(json);
      } catch {
        res.status(tgRes.statusCode || 200).send(body);
      }
    });
  });
  r.on('error', (err) => {
    console.error('getUpdates error:', err);
    res.status(500).json({ error: String(err) });
  });
  r.end();
});
// Scheduler debug endpoint
app.get('/api/notifications/scheduled', (req, res) => {
  const now = Date.now();
  const sessions = readData('sessions');
  const items = Array.from(scheduledJobs.keys()).map((id) => {
    const s = sessions.find((x) => x.id === id);
    const start = s ? parseSessionDateTime(s) : null;
    const sendAt = start ? start.getTime() - SCHEDULE_AHEAD_MS : null;
    const inMs = sendAt != null ? sendAt - now : null;
    return {
      id,
      patient_id: s?.patient_id,
      status: s?.status,
      date: s?.date,
      sendAt,
      inMs,
      inMinutes: inMs != null ? Math.round(inMs / 60000) : null,
    };
  });
  res.json({ now, count: items.length, items });
});

app.listen(PORT, () => {
  console.log(`Neutro Admin Backend server running on port ${PORT}`);
});