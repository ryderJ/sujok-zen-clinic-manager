
import { useState } from "react";
import { X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTreatment } from "@/hooks/useTreatments";
import { useTherapySessions } from "@/hooks/useTherapySessions";
import { Patient } from "@/lib/supabase";

interface AddTreatmentFormProps {
  patient: Patient;
  onClose: () => void;
}

export const AddTreatmentForm = ({ patient, onClose }: AddTreatmentFormProps) => {
  const [formData, setFormData] = useState({
    session_id: "",
    description: "",
    notes: "",
    duration: 45
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const createTreatment = useCreateTreatment();
  const { data: sessions = [] } = useTherapySessions();
  
  // Filtriraj sesije samo za ovog pacijenta
  const patientSessions = sessions.filter(session => 
    session.patient_id === patient.id && session.status === 'odrađena'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedSession = patientSessions.find(s => s.id === formData.session_id);
    
    createTreatment.mutate({
      patient_id: patient.id,
      date: selectedSession?.date || new Date().toISOString().split('T')[0],
      description: formData.description,
      notes: formData.notes || undefined,
      duration: formData.duration,
      photos: uploadedImages
    });
    
    if (!createTreatment.isPending) {
      onClose();
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((_, index) => `photo-${Date.now()}-${index}`);
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Dodaj tretman</h2>
            <p className="text-sm text-slate-500">za {patient.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="session">Odaberi završenu sesiju *</Label>
            <Select value={formData.session_id} onValueChange={(value) => handleChange("session_id", value)}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Odaberi sesiju iz liste" />
              </SelectTrigger>
              <SelectContent>
                {patientSessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {new Date(session.date).toLocaleDateString('sr-RS')} - {session.type} ({session.time})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {patientSessions.length === 0 && (
              <p className="text-sm text-slate-500 mt-1">
                Nema završenih sesija za ovog pacijenta
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="duration">Trajanje (minuti) *</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => handleChange("duration", parseInt(e.target.value))}
              placeholder="45"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Opis tretmana *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="npr. Su Jok terapija ruku za probleme sa varenjem"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Napomene o tretmanu</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Zabeleži zapažanja, povratne informacije pacijenta, preporuke..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="photos">Fotografije tretmana</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Otpremi fotografije tretmana</p>
                  <p className="text-xs text-slate-400">Klikni da odabereš datoteke</p>
                </div>
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-slate-600 mb-2 flex items-center">
                  <Image className="w-4 h-4 mr-1" />
                  {uploadedImages.length} slika učitano
                </p>
                <div className="flex space-x-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Image className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 rounded-xl"
              disabled={createTreatment.isPending}
            >
              Otkaži
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              disabled={createTreatment.isPending || !formData.session_id}
            >
              {createTreatment.isPending ? 'Beležim...' : 'Zabelež tretman'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
