
import { useState } from "react";
import { X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddTreatmentFormProps {
  patient: any;
  onClose: () => void;
}

export const AddTreatmentForm = ({ patient, onClose }: AddTreatmentFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    notes: "",
    duration: "45"
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to local storage
    console.log("New treatment:", { ...formData, patient: patient.name, photos: uploadedImages });
    toast.success("Treatment recorded successfully!");
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you'd handle file upload here
      // For demo, we'll use placeholder images
      const newImages = Array.from(files).map(() => "photo-1535268647677-300dbf3d78d1");
      setUploadedImages(prev => [...prev, ...newImages]);
      toast.success(`${files.length} image(s) uploaded`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Add Treatment</h2>
            <p className="text-sm text-slate-500">for {patient.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Treatment Date *</Label>
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
            <Label htmlFor="description">Treatment Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Su Jok hand therapy for digestive issues"
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Treatment Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Record observations, patient feedback, recommendations..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="photos">Treatment Photos</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Upload treatment photos</p>
                  <p className="text-xs text-slate-400">Click to select files</p>
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
                  {uploadedImages.length} image(s) uploaded
                </p>
                <div className="flex space-x-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/${image}?w=150&h=150&fit=crop&auto=format`}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
              Record Treatment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
