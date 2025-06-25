
import { useState, useEffect } from 'react';
import { localDB, Patient } from '@/lib/localDatabase';
import { toast } from 'sonner';

export const usePatients = () => {
  const [data, setData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPatients = () => {
    try {
      const patients = localDB.getPatients();
      setData(patients);
    } catch (error) {
      console.error('Greška pri učitavanju pacijenata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return {
    data,
    isLoading,
    refetch: loadPatients
  };
};

export const useCreatePatient = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    setIsPending(true);
    try {
      localDB.addPatient(patient);
      toast.success('Pacijent je uspešno dodat!');
      // Trigger refetch by dispatching custom event
      window.dispatchEvent(new CustomEvent('dataChanged'));
    } catch (error) {
      toast.error('Greška pri dodavanju pacijenta');
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};

export const useUpdatePatient = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async ({ id, ...updates }: Partial<Patient> & { id: string }) => {
    setIsPending(true);
    try {
      localDB.updatePatient(id, updates);
      toast.success('Podaci o pacijentu su ažurirani!');
      window.dispatchEvent(new CustomEvent('dataChanged'));
    } catch (error) {
      toast.error('Greška pri ažuriranju pacijenta');
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};

export const useDeletePatient = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (id: string) => {
    setIsPending(true);
    try {
      localDB.deletePatient(id);
      toast.success('Pacijent je uspešno obrisan!');
      window.dispatchEvent(new CustomEvent('dataChanged'));
    } catch (error) {
      toast.error('Greška pri brisanju pacijenta');
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};
