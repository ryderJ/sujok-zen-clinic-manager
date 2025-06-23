import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Patient } from '@/lib/supabase';
import { toast } from 'sonner';

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Patient[];
    },
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('patients')
        .insert([patient])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Pacijent je uspešno dodat!');
    },
    onError: (error) => {
      toast.error('Greška pri dodavanju pacijenta: ' + error.message);
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Patient> & { id: string }) => {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Podaci o pacijentu su ažurirani!');
    },
    onError: (error) => {
      toast.error('Greška pri ažuriranju pacijenta: ' + error.message);
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['therapy-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      toast.success('Pacijent je uspešno obrisan!');
    },
    onError: (error) => {
      toast.error('Greška pri brisanju pacijenta: ' + error.message);
    },
  });
};