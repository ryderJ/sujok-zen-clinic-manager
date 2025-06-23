import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Treatment } from '@/lib/supabase';
import { toast } from 'sonner';

export const useTreatments = (patientId?: string) => {
  return useQuery({
    queryKey: ['treatments', patientId],
    queryFn: async () => {
      let query = supabase
        .from('treatments')
        .select(`
          *,
          patient:patients(*)
        `)
        .order('date', { ascending: false });
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Treatment[];
    },
  });
};

export const useCreateTreatment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (treatment: Omit<Treatment, 'id' | 'created_at' | 'updated_at' | 'patient'>) => {
      const { data, error } = await supabase
        .from('treatments')
        .insert([treatment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success('Tretman je uspešno zabeležen!');
    },
    onError: (error) => {
      toast.error('Greška pri beleženju tretmana: ' + error.message);
    },
  });
};

export const useDeleteTreatment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('treatments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success('Tretman je uspešno obrisan!');
    },
    onError: (error) => {
      toast.error('Greška pri brisanju tretmana: ' + error.message);
    },
  });
};