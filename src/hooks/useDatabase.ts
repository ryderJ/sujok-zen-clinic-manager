import { useState, useEffect, useCallback } from 'react';
import { db, Patient, TherapySession, Treatment } from '@/lib/database';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      try {
        const patientsData = await db.getPatients();
        setPatients(patientsData);
      } catch (error) {
        console.error('Failed to load patients:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();

    const handleStorageChange = async () => {
      try {
        const patientsData = await db.getPatients();
        setPatients(patientsData);
      } catch (error) {
        console.error('Failed to reload patients:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addPatient = useCallback(async (patientData: Omit<Patient, 'id' | 'created_at'>) => {
    const newPatient = await db.addPatient(patientData);
    const updatedPatients = await db.getPatients();
    setPatients(updatedPatients);
    return newPatient;
  }, []);

  const updatePatient = useCallback(async (id: string, updates: Partial<Patient>) => {
    const updatedPatient = await db.updatePatient(id, updates);
    const updatedPatients = await db.getPatients();
    setPatients(updatedPatients);
    return updatedPatient;
  }, []);

  const deletePatient = useCallback(async (id: string) => {
    const result = await db.deletePatient(id);
    const updatedPatients = await db.getPatients();
    setPatients(updatedPatients);
    return result;
  }, []);

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
  };
};

export const useSessions = () => {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const sessionsData = await db.getSessions();
        setSessions(sessionsData);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();

    const handleStorageChange = async () => {
      try {
        const sessionsData = await db.getSessions();
        setSessions(sessionsData);
      } catch (error) {
        console.error('Failed to reload sessions:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addSession = useCallback(async (sessionData: Omit<TherapySession, 'id' | 'created_at'>) => {
    const newSession = await db.addSession(sessionData);
    const updatedSessions = await db.getSessions();
    setSessions(updatedSessions);
    return newSession;
  }, []);

  const updateSession = useCallback(async (id: string, updates: Partial<TherapySession>) => {
    const updatedSession = await db.updateSession(id, updates);
    const updatedSessions = await db.getSessions();
    setSessions(updatedSessions);
    return updatedSession;
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    const result = await db.deleteSession(id);
    const updatedSessions = await db.getSessions();
    setSessions(updatedSessions);
    return result;
  }, []);

  return {
    sessions,
    loading,
    addSession,
    updateSession,
    deleteSession,
  };
};

export const useTreatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTreatments = async () => {
      setLoading(true);
      try {
        const treatmentsData = await db.getTreatments();
        setTreatments(treatmentsData);
      } catch (error) {
        console.error('Failed to load treatments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTreatments();

    const handleStorageChange = async () => {
      try {
        const treatmentsData = await db.getTreatments();
        setTreatments(treatmentsData);
      } catch (error) {
        console.error('Failed to reload treatments:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addTreatment = useCallback(async (treatmentData: Omit<Treatment, 'id' | 'created_at'>, images?: File[]) => {
    const newTreatment = await db.addTreatment(treatmentData, images);
    const updatedTreatments = await db.getTreatments();
    setTreatments(updatedTreatments);
    return newTreatment;
  }, []);

  const deleteTreatment = useCallback(async (id: string) => {
    const result = await db.deleteTreatment(id);
    const updatedTreatments = await db.getTreatments();
    setTreatments(updatedTreatments);
    return result;
  }, []);

  return {
    treatments,
    loading,
    addTreatment,
    deleteTreatment,
  };
};