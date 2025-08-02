
import { useState, useEffect } from 'react';
import { db, Patient, TherapySession, Treatment } from '@/lib/database';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = () => {
      setPatients(db.getPatients());
      setLoading(false);
    };
    loadPatients();
    
    // Listen for storage changes for real-time updates
    const handleStorageChange = () => {
      setPatients(db.getPatients());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addPatient = (patientData: Omit<Patient, 'id' | 'created_at'>) => {
    const newPatient = db.addPatient(patientData);
    const updatedPatients = db.getPatients();
    setPatients(updatedPatients);
    // Trigger storage event for other components
    window.dispatchEvent(new StorageEvent('storage'));
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const updated = db.updatePatient(id, updates);
    if (updated) {
      setPatients(db.getPatients());
      window.dispatchEvent(new StorageEvent('storage'));
    }
    return updated;
  };

  const deletePatient = (id: string) => {
    const success = db.deletePatient(id);
    if (success) {
      setPatients(db.getPatients());
      window.dispatchEvent(new StorageEvent('storage'));
    }
    return success;
  };

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    refresh: () => setPatients(db.getPatients())
  };
};

export const useSessions = () => {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSessions(db.getSessions());
    setLoading(false);
    
    const handleStorageChange = () => {
      setSessions(db.getSessions());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addSession = (sessionData: Omit<TherapySession, 'id' | 'created_at'>) => {
    const newSession = db.addSession(sessionData);
    setSessions(db.getSessions());
    window.dispatchEvent(new StorageEvent('storage'));
    return newSession;
  };

  const updateSession = (id: string, updates: Partial<TherapySession>) => {
    const updated = db.updateSession(id, updates);
    if (updated) {
      setSessions(db.getSessions());
      window.dispatchEvent(new StorageEvent('storage'));
    }
    return updated;
  };

  const deleteSession = (id: string) => {
    const success = db.deleteSession(id);
    if (success) {
      setSessions(db.getSessions());
      window.dispatchEvent(new StorageEvent('storage'));
    }
    return success;
  };

  return {
    sessions,
    loading,
    addSession,
    updateSession,
    deleteSession,
    refresh: () => setSessions(db.getSessions())
  };
};

export const useTreatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTreatments(db.getTreatments());
    setLoading(false);
    
    const handleStorageChange = () => {
      setTreatments(db.getTreatments());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addTreatment = (treatmentData: Omit<Treatment, 'id' | 'created_at'>) => {
    const newTreatment = db.addTreatment(treatmentData);
    setTreatments(db.getTreatments());
    window.dispatchEvent(new StorageEvent('storage'));
    return newTreatment;
  };

  const deleteTreatment = (id: string) => {
    const success = db.deleteTreatment(id);
    if (success) {
      setTreatments(db.getTreatments());
      window.dispatchEvent(new StorageEvent('storage'));
    }
    return success;
  };

  return {
    treatments,
    loading,
    addTreatment,
    deleteTreatment,
    refresh: () => setTreatments(db.getTreatments())
  };
};
