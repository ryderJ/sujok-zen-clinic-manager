import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type TherapySession } from '@/lib/supabase';
import { toast } from 'sonner';

export const useTherapySessions = () => {
  return useQuery({
    queryKey: ['therapy-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select(`
          *,
          patient:patients(*)
        `)
        .order('date', { ascending: false })
        .order('time', { ascending: false });
      
      if (error) throw error;
      return data as TherapySession[];
    },
  });
};

export const useCreateTherapySession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (session: Omit<TherapySession, 'id' | 'created_at' | 'updated_at' | 'patient'>) => {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert([session])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapy-sessions'] });
      toast.success('Terapijska sesija je uspešno zakazana!');
    },
    onError: (error) => {
      toast.error('Greška pri zakazivanju sesije: ' + error.message);
    },
  });
};

export const useUpdateTherapySession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TherapySession> & { id: string }) => {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapy-sessions'] });
      toast.success('Sesija je ažurirana!');
    },
    onError: (error) => {
      toast.error('Greška pri ažuriranju sesije: ' + error.message);
    },
  });
};

export const useDeleteTherapySession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('therapy_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapy-sessions'] });
      toast.success('Sesija je uspešno obrisana!');
    },
    onError: (error) => {
      toast.error('Greška pri brisanju sesije: ' + error.message);
    },
  });
};