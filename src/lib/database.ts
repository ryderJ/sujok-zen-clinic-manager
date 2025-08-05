const API_BASE_URL = 'http://localhost:3001/api';

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
  session_id?: string;
  date: string;
  type: string;
  description: string;
  category_id?: string;
  images?: string[];
  created_at: string;
}

export interface TreatmentCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

class ApiDatabase {
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
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Patient operations
  async getPatients(): Promise<Patient[]> {
    return await this.apiCall('/patients');
  }

  async addPatient(patient: Omit<Patient, 'id' | 'created_at'>): Promise<Patient> {
    return await this.apiCall('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    return await this.apiCall(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
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
    return await this.apiCall('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
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
      
      // Add treatment data
      Object.keys(treatment).forEach(key => {
        formData.append(key, (treatment as any)[key]);
      });
      
      // Add images
      images.forEach(image => {
        formData.append('images', image);
      });
      
      return await this.apiCall('/treatments', {
        method: 'POST',
        headers: {}, // Remove Content-Type to let browser set it for FormData
        body: formData,
      });
    } else {
      return await this.apiCall('/treatments', {
        method: 'POST',
        body: JSON.stringify(treatment),
      });
    }
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
    return await this.apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
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

export const db = new ApiDatabase();
