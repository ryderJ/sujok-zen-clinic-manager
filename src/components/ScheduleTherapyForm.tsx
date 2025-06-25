import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePatients } from "@/hooks/usePatients";
import { useCreateTherapySession } from "@/hooks/useTherapySessions";

interface ScheduleTherapyFormProps {
  onClose: () => void;
}

const therapyTypes = [
  "Su Jok terapija",
  "Akupresura sesija",
  "Inicijalna konsultacija",
  "Kontrolna sesija",
  "Refleksologija"
];

export const ScheduleTherapyForm = ({ onClose }: ScheduleTherapyFormProps) => {
  const [formData, setFormData] = useState({
    patient_id: "",
    date: "",
    time: "",
    type: "",
    duration: 45,
    notes: ""
  });

  const { data: patients = [] } = usePatients();
  const createSession = useCreateTherapySession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createSession.mutate({
      patient_id: formData.patient_id,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      duration: formData.duration,
      status: 'zakazana',
      notes: formData.notes || undefined
    });
    
    if (!createSession.isPending) {
      onClose();
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Zakaži terapijsku sesiju</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient">Pacijent *</Label>
            <Select value={formData.patient_id} onValueChange={(value) => handleChange("patient_id", value)}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Odaberi pacijenta" />
              </SelectTrigger>
              <SelectContent>
                {patients.filter(p => p.is_active).map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Vreme *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="therapyType">Tip terapije *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Odaberi tip terapije" />
              </SelectTrigger>
              <SelectContent>
                {therapyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="notes">Napomene o sesiji</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Dodaj posebne napomene za ovu sesiju..."
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
              disabled={createSession.isPending}
            >
              Otkaži
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              disabled={createSession.isPending}
            >
              {createSession.isPending ? 'Zakazujem...' : 'Zakaži sesiju'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
