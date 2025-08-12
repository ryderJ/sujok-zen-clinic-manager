
import { useState } from "react";
import { X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTreatments } from "@/hooks/useDatabase";
import { Patient } from "@/lib/database";

interface AddTreatmentFormProps {
  patient: Patient;
  onClose: () => void;
}

export const AddTreatmentForm = ({ patient, onClose }: AddTreatmentFormProps) => {
  const [formData, setFormData] = useState({
    type: "",
    description: ""
  });
  const [images, setImages] = useState<File[]>([]);

  const { addTreatment } = useTreatments();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await addTreatment({
    patient_id: patient.id,
    date: new Date().toISOString().split('T')[0],
    type: formData.type,
    description: formData.description
  }, images);
  onClose();
};

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <Label htmlFor="type">Tip tretmana *</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="npr. Su Jok terapija"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Opis tretmana *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Detaljno opišite tretman koji je izvršen..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="images">Slike (opciono)</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="rounded-xl"
            />
            {images.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">{images.length} slika spremno za upload</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 rounded-xl"
            >
              Otkaži
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              Zabeleži tretman
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
