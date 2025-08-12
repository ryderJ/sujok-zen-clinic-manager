
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePatients } from "@/hooks/useDatabase";
import { Patient } from "@/lib/database";

interface EditPatientFormProps {
  patient: Patient;
  onClose: () => void;
  onSave: (updatedPatient: Patient) => void;
}

export const EditPatientForm = ({ patient, onClose, onSave }: EditPatientFormProps) => {
  const [formData, setFormData] = useState({
    name: patient.name || "",
    date_of_birth: patient.date_of_birth || "",
    phone: patient.phone || "",
    email: patient.email || "",
    notes: patient.notes || ""
  });

  const { updatePatient } = usePatients();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedPatient = await updatePatient(patient.id, {
        name: formData.name,
        date_of_birth: formData.date_of_birth,
        phone: formData.phone,
        email: formData.email || undefined,
        notes: formData.notes || undefined,
      });
      
      if (updatedPatient) {
        onSave(updatedPatient);
      }
      onClose();
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Izmeni podatke pacijenta</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ime i prezime *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Unesite ime i prezime pacijenta"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="dob">Datum rođenja *</Label>
            <Input
              id="dob"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Broj telefona *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+381 60 123 4567"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email adresa</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="pacijent@email.com"
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="notes">Zdravstveno stanje i napomene</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Unesite zdravstveno stanje, alergije ili napomene..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
              rows={3}
            />
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
              Sačuvaj izmene
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
