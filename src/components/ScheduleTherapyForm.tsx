
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePatients, useSessions } from "@/hooks/useDatabase";

interface ScheduleTherapyFormProps {
  onClose: () => void;
}

export const ScheduleTherapyForm = ({ onClose }: ScheduleTherapyFormProps) => {
  const [formData, setFormData] = useState({
    patient_id: "",
    date: "",
    time: "09:00",
    duration_minutes: 60,
    notes: ""
  });

  const { patients } = usePatients();
  const { addSession } = useSessions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addSession({
      patient_id: formData.patient_id,
      date: `${formData.date}T${formData.time}`,
      status: 'zakazana',
      duration_minutes: formData.duration_minutes,
      notes: formData.notes || undefined
    });
    
    onClose();
  };

  const handleChange = (field: string, value: string) => {
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

          <div>
            <Label htmlFor="duration">Planiran trajanje (minuti) *</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              max="180"
              step="15"
              value={formData.duration_minutes}
              onChange={(e) => handleChange("duration_minutes", e.target.value)}
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
            >
              Otkaži
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              Zakaži sesiju
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
