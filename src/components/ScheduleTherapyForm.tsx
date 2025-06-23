
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ScheduleTherapyFormProps {
  onClose: () => void;
}

// Mock patients for selection
const mockPatients = [
  { id: 1, name: "Maria Rodriguez" },
  { id: 2, name: "John Chen" },
  { id: 3, name: "Sarah Williams" }
];

const therapyTypes = [
  "Su Jok Therapy",
  "Acupressure Session",
  "Initial Consultation",
  "Follow-up Session",
  "Reflexology"
];

export const ScheduleTherapyForm = ({ onClose }: ScheduleTherapyFormProps) => {
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    therapyType: "",
    duration: "45",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to local storage
    console.log("New appointment:", formData);
    toast.success("Therapy session scheduled successfully!");
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Schedule Therapy Session</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient">Patient *</Label>
            <Select value={formData.patientId} onValueChange={(value) => handleChange("patientId", value)}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
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
              <Label htmlFor="time">Time *</Label>
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
            <Label htmlFor="therapyType">Therapy Type *</Label>
            <Select value={formData.therapyType} onValueChange={(value) => handleChange("therapyType", value)}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Select therapy type" />
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
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              placeholder="45"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Session Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add any special notes for this session..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
              Schedule Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
