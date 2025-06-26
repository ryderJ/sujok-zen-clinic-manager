
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
  }, []);

  const addPatient = (patientData: Omit<Patient, 'id' | 'created_at'>) => {
    const newPatient = db.addPatient(patientData);
    setPatients(db.getPatients());
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const updated = db.updatePatient(id, updates);
    if (updated) {
      setPatients(db.getPatients());
    }
    return updated;
  };

  const deletePatient = (id: string) => {
    const success = db.deletePatient(id);
    if (success) {
      setPatients(db.getPatients());
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
  }, []);

  const addSession = (sessionData: Omit<TherapySession, 'id' | 'created_at'>) => {
    const newSession = db.addSession(sessionData);
    setSessions(db.getSessions());
    return newSession;
  };

  const updateSession = (id: string, updates: Partial<TherapySession>) => {
    const updated = db.updateSession(id, updates);
    if (updated) {
      setSessions(db.getSessions());
    }
    return updated;
  };

  const deleteSession = (id: string) => {
    const success = db.deleteSession(id);
    if (success) {
      setSessions(db.getSessions());
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
  }, []);

  const addTreatment = (treatmentData: Omit<Treatment, 'id' | 'created_at'>) => {
    const newTreatment = db.addTreatment(treatmentData);
    setTreatments(db.getTreatments());
    return newTreatment;
  };

  const deleteTreatment = (id: string) => {
    const success = db.deleteTreatment(id);
    if (success) {
      setTreatments(db.getTreatments());
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
