const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

  private async apiCall(endpoint: string, options: RequestInit = {}) {
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
  }

  // Patient operations
  async getPatients(): Promise<Patient[]> {
    return await this.apiCall('/patients');
  }

  async addPatient(patient: Omit<Patient, 'id' | 'created_at'>): Promise<Patient> {
    const result = await this.apiCall('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'patients' } }));
    return result;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const result = await this.apiCall(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'patients' } }));
    return result;
  }

  async deletePatient(id: string): Promise<boolean> {
    await this.apiCall(`/patients/${id}`, { method: 'DELETE' });
    return true;
  }

  // Session operations
  async getSessions(): Promise<TherapySession[]> {
    return await this.apiCall('/sessions');
  }

  async addSession(session: Omit<TherapySession, 'id' | 'created_at'>): Promise<TherapySession> {
    const result = await this.apiCall('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'sessions' } }));
    return result;
  }

  async updateSession(id: string, updates: Partial<TherapySession>): Promise<TherapySession> {
    return await this.apiCall(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSession(id: string): Promise<boolean> {
    await this.apiCall(`/sessions/${id}`, { method: 'DELETE' });
    return true;
  }

  // Treatment operations
  async getTreatments(): Promise<Treatment[]> {
    return await this.apiCall('/treatments');
  }

  async addTreatment(treatment: Omit<Treatment, 'id' | 'created_at'>, images?: File[]): Promise<Treatment> {
    if (images && images.length > 0) {
      const formData = new FormData();
      Object.keys(treatment).forEach(key => {
        const value = (treatment as any)[key];
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      images.forEach(image => {
        formData.append('images', image);
      });
      
      const response = await fetch(`${API_BASE_URL}/treatments`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const result = await response.json();
      window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'treatments' } }));
      return result;
    } else {
      const result = await this.apiCall('/treatments', {
        method: 'POST',
        body: JSON.stringify(treatment),
      });
      window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'treatments' } }));
      return result;
    }
  }

  async updateTreatment(id: string, updates: Partial<Treatment>): Promise<Treatment> {
    const result = await this.apiCall(`/treatments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'treatments' } }));
    return result;
  }

  async deleteTreatment(id: string): Promise<boolean> {
    await this.apiCall(`/treatments/${id}`, { method: 'DELETE' });
    return true;
  }

  // Category operations
  async getCategories(): Promise<TreatmentCategory[]> {
    return await this.apiCall('/categories');
  }

  async addCategory(category: Omit<TreatmentCategory, 'id' | 'created_at'>): Promise<TreatmentCategory> {
    const result = await this.apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { type: 'categories' } }));
    return result;
  }

  async updateCategory(id: string, updates: Partial<TreatmentCategory>): Promise<TreatmentCategory> {
    return await this.apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCategory(id: string): Promise<boolean> {
    await this.apiCall(`/categories/${id}`, { method: 'DELETE' });
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
