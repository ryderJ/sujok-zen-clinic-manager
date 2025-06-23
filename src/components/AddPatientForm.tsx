
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddPatientFormProps {
  onClose: () => void;
}

export const AddPatientForm = ({ onClose }: AddPatientFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    conditions: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to local storage
    console.log("New patient:", formData);
    toast.success("Patient added successfully!");
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Add New Patient</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter patient's full name"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="patient@email.com"
              className="rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="conditions">Health Conditions & Notes</Label>
            <textarea
              id="conditions"
              value={formData.conditions}
              onChange={(e) => handleChange("conditions", e.target.value)}
              placeholder="Enter any health conditions, allergies, or notes..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
              Add Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
