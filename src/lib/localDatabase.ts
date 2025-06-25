
// Lokalna baza podataka koja koristi localStorage
export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  phone: string;
  email?: string;
  conditions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TherapySession {
  id: string;
  patient_id: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  status: 'zakazana' | 'odrađena' | 'propuštena';
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

export interface Treatment {
  id: string;
  patient_id: string;
  date: string;
  description: string;
  notes?: string;
  duration: number;
  photos: string[];
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

class LocalDatabase {
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Patients
  getPatients(): Patient[] {
    return this.getFromStorage<Patient>('patients');
  }

  addPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Patient {
    const patients = this.getPatients();
    const newPatient: Patient = {
      ...patient,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    patients.push(newPatient);
    this.saveToStorage('patients', patients);
    return newPatient;
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    patients[index] = { ...patients[index], ...updates, updated_at: new Date().toISOString() };
    this.saveToStorage('patients', patients);
    return patients[index];
  }

  deletePatient(id: string): boolean {
    const patients = this.getPatients();
    const filtered = patients.filter(p => p.id !== id);
    if (filtered.length === patients.length) return false;
    
    this.saveToStorage('patients', filtered);
    // Takođe obriši sve vezane sesije i tretmane
    this.deleteSessionsByPatient(id);
    this.deleteTreatmentsByPatient(id);
    return true;
  }

  // Therapy Sessions
  getTherapySessions(): TherapySession[] {
    const sessions = this.getFromStorage<TherapySession>('therapy_sessions');
    const patients = this.getPatients();
    
    return sessions.map(session => ({
      ...session,
      patient: patients.find(p => p.id === session.patient_id)
    }));
  }

  addTherapySession(session: Omit<TherapySession, 'id' | 'created_at' | 'updated_at' | 'patient'>): TherapySession {
    const sessions = this.getFromStorage<TherapySession>('therapy_sessions');
    const newSession: TherapySession = {
      ...session,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    sessions.push(newSession);
    this.saveToStorage('therapy_sessions', sessions);
    return newSession;
  }

  updateTherapySession(id: string, updates: Partial<TherapySession>): TherapySession | null {
    const sessions = this.getFromStorage<TherapySession>('therapy_sessions');
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    sessions[index] = { ...sessions[index], ...updates, updated_at: new Date().toISOString() };
    this.saveToStorage('therapy_sessions', sessions);
    return sessions[index];
  }

  deleteTherapySession(id: string): boolean {
    const sessions = this.getFromStorage<TherapySession>('therapy_sessions');
    const filtered = sessions.filter(s => s.id !== id);
    if (filtered.length === sessions.length) return false;
    
    this.saveToStorage('therapy_sessions', filtered);
    return true;
  }

  private deleteSessionsByPatient(patientId: string): void {
    const sessions = this.getFromStorage<TherapySession>('therapy_sessions');
    const filtered = sessions.filter(s => s.patient_id !== patientId);
    this.saveToStorage('therapy_sessions', filtered);
  }

  // Treatments
  getTreatments(patientId?: string): Treatment[] {
    const treatments = this.getFromStorage<Treatment>('treatments');
    const patients = this.getPatients();
    
    let filtered = treatments;
    if (patientId) {
      filtered = treatments.filter(t => t.patient_id === patientId);
    }
    
    return filtered.map(treatment => ({
      ...treatment,
      patient: patients.find(p => p.id === treatment.patient_id)
    }));
  }

  addTreatment(treatment: Omit<Treatment, 'id' | 'created_at' | 'updated_at' | 'patient'>): Treatment {
    const treatments = this.getFromStorage<Treatment>('treatments');
    const newTreatment: Treatment = {
      ...treatment,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    treatments.push(newTreatment);
    this.saveToStorage('treatments', treatments);
    return newTreatment;
  }

  deleteTreatment(id: string): boolean {
    const treatments = this.getFromStorage<Treatment>('treatments');
    const filtered = treatments.filter(t => t.id !== id);
    if (filtered.length === treatments.length) return false;
    
    this.saveToStorage('treatments', filtered);
    return true;
  }

  private deleteTreatmentsByPatient(patientId: string): void {
    const treatments = this.getFromStorage<Treatment>('treatments');
    const filtered = treatments.filter(t => t.patient_id !== patientId);
    this.saveToStorage('treatments', filtered);
  }

  // Utility methods
  clearAllData(): void {
    localStorage.removeItem('patients');
    localStorage.removeItem('therapy_sessions');
    localStorage.removeItem('treatments');
  }
}

export const localDB = new LocalDatabase();
