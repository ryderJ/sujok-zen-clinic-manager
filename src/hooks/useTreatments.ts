
import { useState, useEffect } from 'react';
import { localDB, Treatment } from '@/lib/localDatabase';
import { toast } from 'sonner';

export const useTreatments = (patientId?: string) => {
  const [data, setData] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTreatments = () => {
    try {
      const treatments = localDB.getTreatments(patientId);
      setData(treatments);
    } catch (error) {
      console.error('Greška pri učitavanju tretmana:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTreatments();
    
    const handleDataChange = () => loadTreatments();
    window.addEventListener('dataChanged', handleDataChange);
    
    return () => window.removeEventListener('dataChanged', handleDataChange);
  }, [patientId]);

  return {
    data,
    isLoading,
    refetch: loadTreatments
  };
};

export const useCreateTreatment = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (treatment: Omit<Treatment, 'id' | 'created_at' | 'updated_at' | 'patient'>) => {
    setIsPending(true);
    try {
      localDB.addTreatment(treatment);
      toast.success('Tretman je uspešno zabeležen!');
      window.dispatchEvent(new CustomEvent('dataChanged'));
    } catch (error) {
      toast.error('Greška pri beleženju tretmana');
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};

export const useDeleteTreatment = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (id: string) => {
    setIsPending(true);
    try {
      localDB.deleteTreatment(id);
      toast.success('Tretman je uspešno obrisan!');
      window.dispatchEvent(new CustomEvent('dataChanged'));
    } catch (error) {
      toast.error('Greška pri brisanju tretmana');
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};
