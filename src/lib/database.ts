const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Fallback to localStorage when API is not available
const isApiAvailable = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      timeout: 1000 
    } as any);
    return response.ok;
  } catch {
    return false;
  }
};

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
  duration_minutes?: number;
  notes?: string;
  created_at: string;
}

export interface Treatment {
  id: string;
  patient_id: string;
  session_id?: string;
  date: string;
  type: string;
  description: string;
  category_id?: string;
  duration_minutes?: number;
  images?: string[];
  created_at: string;
}

export interface TreatmentCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

class Database {
  private useApi = false;

  constructor() {
    this.checkApiAvailability();
  }

  private async checkApiAvailability() {
    this.useApi = await isApiAvailable();
    console.log('Using API:', this.useApi);
  }

  private async apiCall(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed, falling back to localStorage:', error);
      this.useApi = false;
      throw error;
    }
  }

  // localStorage operations
  private getFromStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new StorageEvent('storage'));
  }

  // Patient operations
  async getPatients(): Promise<Patient[]> {
    if (this.useApi) {
      try {
        return await this.apiCall('/patients');
      } catch {
        this.useApi = false;
      }
    }
    return this.getFromStorage<Patient>('neutro_patients');
  }

  async addPatient(patient: Omit<Patient, 'id' | 'created_at'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    if (this.useApi) {
      try {
        return await this.apiCall('/patients', {
          method: 'POST',
          body: JSON.stringify(patient),
        });
      } catch {
        this.useApi = false;
      }
    }
    
    const patients = this.getFromStorage<Patient>('neutro_patients');
    patients.push(newPatient);
    this.saveToStorage('neutro_patients', patients);
    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    if (this.useApi) {
      try {
        return await this.apiCall(`/patients/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
      } catch {
        this.useApi = false;
      }
    }

    const patients = this.getFromStorage<Patient>('neutro_patients');
    const index = patients.findIndex(p => p.id === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates };
      this.saveToStorage('neutro_patients', patients);
      return patients[index];
    }
    throw new Error('Patient not found');
  }

  async deletePatient(id: string): Promise<boolean> {
    if (this.useApi) {
      try {
        await this.apiCall(`/patients/${id}`, { method: 'DELETE' });
        return true;
      } catch {
        this.useApi = false;
      }
    }

    const patients = this.getFromStorage<Patient>('neutro_patients');
    const filtered = patients.filter(p => p.id !== id);
    this.saveToStorage('neutro_patients', filtered);
    return true;
  }

  // Session operations
  async getSessions(): Promise<TherapySession[]> {
    if (this.useApi) {
      try {
        return await this.apiCall('/sessions');
      } catch {
        this.useApi = false;
      }
    }
    return this.getFromStorage<TherapySession>('neutro_sessions');
  }

  async addSession(session: Omit<TherapySession, 'id' | 'created_at'>): Promise<TherapySession> {
    const newSession: TherapySession = {
      ...session,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    if (this.useApi) {
      try {
        return await this.apiCall('/sessions', {
          method: 'POST',
          body: JSON.stringify(session),
        });
      } catch {
        this.useApi = false;
      }
    }

    const sessions = this.getFromStorage<TherapySession>('neutro_sessions');
    sessions.push(newSession);
    this.saveToStorage('neutro_sessions', sessions);
    return newSession;
  }

  async updateSession(id: string, updates: Partial<TherapySession>): Promise<TherapySession> {
    if (this.useApi) {
      try {
        return await this.apiCall(`/sessions/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
      } catch {
        this.useApi = false;
      }
    }

    const sessions = this.getFromStorage<TherapySession>('neutro_sessions');
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      this.saveToStorage('neutro_sessions', sessions);
      return sessions[index];
    }
    throw new Error('Session not found');
  }

  async deleteSession(id: string): Promise<boolean> {
    if (this.useApi) {
      try {
        await this.apiCall(`/sessions/${id}`, { method: 'DELETE' });
        return true;
      } catch {
        this.useApi = false;
      }
    }

    const sessions = this.getFromStorage<TherapySession>('neutro_sessions');
    const filtered = sessions.filter(s => s.id !== id);
    this.saveToStorage('neutro_sessions', filtered);
    return true;
  }

  // Treatment operations
  async getTreatments(): Promise<Treatment[]> {
    if (this.useApi) {
      try {
        return await this.apiCall('/treatments');
      } catch {
        this.useApi = false;
      }
    }
    return this.getFromStorage<Treatment>('neutro_treatments');
  }

  async addTreatment(treatment: Omit<Treatment, 'id' | 'created_at'>, images?: File[]): Promise<Treatment> {
    const imageUrls: string[] = [];
    
    // Process images - convert to base64 for localStorage
    if (images && images.length > 0) {
      for (const image of images) {
        const base64 = await this.fileToBase64(image);
        imageUrls.push(base64);
      }
    }

    const newTreatment: Treatment = {
      ...treatment,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      images: imageUrls.length > 0 ? imageUrls : undefined,
    };

    if (this.useApi) {
      try {
        if (images && images.length > 0) {
          const formData = new FormData();
          Object.keys(treatment).forEach(key => {
            formData.append(key, (treatment as any)[key]);
          });
          images.forEach(image => {
            formData.append('images', image);
          });
          
          return await this.apiCall('/treatments', {
            method: 'POST',
            headers: {},
            body: formData,
          });
        } else {
          return await this.apiCall('/treatments', {
            method: 'POST',
            body: JSON.stringify(treatment),
          });
        }
      } catch {
        this.useApi = false;
      }
    }

    const treatments = this.getFromStorage<Treatment>('neutro_treatments');
    treatments.push(newTreatment);
    this.saveToStorage('neutro_treatments', treatments);
    return newTreatment;
  }

  async updateTreatment(id: string, updates: Partial<Treatment>): Promise<Treatment> {
    if (this.useApi) {
      try {
        return await this.apiCall(`/treatments/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
      } catch {
        this.useApi = false;
      }
    }

    const treatments = this.getFromStorage<Treatment>('neutro_treatments');
    const index = treatments.findIndex(t => t.id === id);
    if (index !== -1) {
      treatments[index] = { ...treatments[index], ...updates };
      this.saveToStorage('neutro_treatments', treatments);
      return treatments[index];
    }
    throw new Error('Treatment not found');
  }

  async deleteTreatment(id: string): Promise<boolean> {
    if (this.useApi) {
      try {
        await this.apiCall(`/treatments/${id}`, { method: 'DELETE' });
        return true;
      } catch {
        this.useApi = false;
      }
    }

    const treatments = this.getFromStorage<Treatment>('neutro_treatments');
    const filtered = treatments.filter(t => t.id !== id);
    this.saveToStorage('neutro_treatments', filtered);
    return true;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Category operations
  async getCategories(): Promise<TreatmentCategory[]> {
    if (this.useApi) {
      try {
        return await this.apiCall('/categories');
      } catch {
        this.useApi = false;
      }
    }
    return this.getFromStorage<TreatmentCategory>('neutro_treatment_categories');
  }

  async addCategory(category: Omit<TreatmentCategory, 'id' | 'created_at'>): Promise<TreatmentCategory> {
    const newCategory: TreatmentCategory = {
      ...category,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    if (this.useApi) {
      try {
        return await this.apiCall('/categories', {
          method: 'POST',
          body: JSON.stringify(category),
        });
      } catch {
        this.useApi = false;
      }
    }

    const categories = this.getFromStorage<TreatmentCategory>('neutro_treatment_categories');
    categories.push(newCategory);
    this.saveToStorage('neutro_treatment_categories', categories);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<TreatmentCategory>): Promise<TreatmentCategory> {
    if (this.useApi) {
      try {
        return await this.apiCall(`/categories/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
      } catch {
        this.useApi = false;
      }
    }

    const categories = this.getFromStorage<TreatmentCategory>('neutro_treatment_categories');
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.saveToStorage('neutro_treatment_categories', categories);
      return categories[index];
    }
    throw new Error('Category not found');
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (this.useApi) {
      try {
        await this.apiCall(`/categories/${id}`, { method: 'DELETE' });
        return true;
      } catch {
        this.useApi = false;
      }
    }

    const categories = this.getFromStorage<TreatmentCategory>('neutro_treatment_categories');
    const filtered = categories.filter(c => c.id !== id);
    this.saveToStorage('neutro_treatment_categories', filtered);
    return true;
  }

  // Backup operations
  async createBackup(): Promise<any> {
    return await this.apiCall('/backup');
  }

  async restoreBackup(backup: any): Promise<boolean> {
    await this.apiCall('/restore', {
      method: 'POST',
      body: JSON.stringify(backup),
    });
    return true;
  }
}

export const db = new Database();
