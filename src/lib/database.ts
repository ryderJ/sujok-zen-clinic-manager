
export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  phone: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  notes?: string;
}

export interface TherapySession {
  id: string;
  patient_id: string;
  date: string;
  status: 'zakazana' | 'odrađena' | 'otkazana';
  notes?: string;
  created_at: string;
}

export interface Treatment {
  id: string;
  patient_id: string;
  date: string;
  type: string;
  description: string;
  created_at: string;
}

class LocalDatabase {
  private patients: Patient[] = [];
  private sessions: TherapySession[] = [];
  private treatments: Treatment[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const patientsData = localStorage.getItem('sujok_patients');
      const sessionsData = localStorage.getItem('sujok_sessions');
      const treatmentsData = localStorage.getItem('sujok_treatments');

      this.patients = patientsData ? JSON.parse(patientsData) : [];
      this.sessions = sessionsData ? JSON.parse(sessionsData) : [];
      this.treatments = treatmentsData ? JSON.parse(treatmentsData) : [];
    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
      this.patients = [];
      this.sessions = [];
      this.treatments = [];
    }
  }

  private saveData() {
    try {
      localStorage.setItem('sujok_patients', JSON.stringify(this.patients));
      localStorage.setItem('sujok_sessions', JSON.stringify(this.sessions));
      localStorage.setItem('sujok_treatments', JSON.stringify(this.treatments));
    } catch (error) {
      console.error('Greška pri čuvanju podataka:', error);
    }
  }

  // Patient operations
  getPatients(): Patient[] {
    return [...this.patients];
  }

  addPatient(patient: Omit<Patient, 'id' | 'created_at'>): Patient {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.patients.push(newPatient);
    this.saveData();
    return newPatient;
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.patients[index] = { ...this.patients[index], ...updates };
    this.saveData();
    return this.patients[index];
  }

  deletePatient(id: string): boolean {
    const initialLength = this.patients.length;
    this.patients = this.patients.filter(p => p.id !== id);
    this.sessions = this.sessions.filter(s => s.patient_id !== id);
    this.treatments = this.treatments.filter(t => t.patient_id !== id);
    this.saveData();
    return this.patients.length < initialLength;
  }

  // Session operations
  getSessions(): TherapySession[] {
    return [...this.sessions];
  }

  addSession(session: Omit<TherapySession, 'id' | 'created_at'>): TherapySession {
    const newSession: TherapySession = {
      ...session,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.sessions.push(newSession);
    this.saveData();
    return newSession;
  }

  updateSession(id: string, updates: Partial<TherapySession>): TherapySession | null {
    const index = this.sessions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.sessions[index] = { ...this.sessions[index], ...updates };
    this.saveData();
    return this.sessions[index];
  }

  deleteSession(id: string): boolean {
    const initialLength = this.sessions.length;
    this.sessions = this.sessions.filter(s => s.id !== id);
    this.saveData();
    return this.sessions.length < initialLength;
  }

  // Treatment operations
  getTreatments(): Treatment[] {
    return [...this.treatments];
  }

  addTreatment(treatment: Omit<Treatment, 'id' | 'created_at'>): Treatment {
    const newTreatment: Treatment = {
      ...treatment,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    this.treatments.push(newTreatment);
    this.saveData();
    return newTreatment;
  }

  deleteTreatment(id: string): boolean {
    const initialLength = this.treatments.length;
    this.treatments = this.treatments.filter(t => t.id !== id);
    this.saveData();
    return this.treatments.length < initialLength;
  }
}

export const db = new LocalDatabase();
