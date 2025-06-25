
import { useState, useEffect } from 'react';
import { localDB, TherapySession } from '@/lib/localDatabase';
import { toast } from 'sonner';

export const useTherapySessions = () => {
  const [data, setData] = useState<TherapySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSessions = () => {
    try {
      const sessions = localDB.getTherapySessions();
      setData(sessions);
    } catch (error) {
      console.error('Greška pri učitavanju sesija:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    
    const handleDataChange = () => loadSessions();
    window.addEventListener('dataChanged', handleDataChange);
    
    return () => window.removeEventListener('dataChanged', handleDataChange);
  }, []);

  return {
    data,
    isLoading,
    refetch: loadSessions
  };
};

export const useCreateTherapySession = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (session: Omit<TherapySession, 'id' | 'created_at' | 'updated_at' | 'patient'>) => {
    setIsPending(true);
    try {
      localDB.addTherapySession(session);
      toast.success('Terapijska sesija je uspešno zakazana!');
      window.dispatchEvent(new CustomEvent('dataChanged'));
    } catch (error) {
      toast.error('Greška pri zakazivanju sesije');
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};

export const useUpdateTherapySession = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async ({ id, ...updates }: Partial<TherapySession> & { id: string }) => {
    setIsPending(true);
    try {
      localDB.updateTherapySession(id, updates);
      toast.success('Sesija je ažurirana!');
      window.dispatchEvent(new CustomEvent('dataChanged'));
    } catch (error) {
      toast.error('Greška pri ažuriranju sesije');
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};

export const useDeleteTherapySession = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (id: string) => {
    setIsPending(true);
    try {
      localDB.deleteTherapySession(id);
      toast.success('Sesija je uspešno obrisana!');
      window.dispatchEvent(new CustomEvent('dataChanged'));
    } catch (error) {
      toast.error('Greška pri brisanju sesije');
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};
