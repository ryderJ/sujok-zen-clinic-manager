import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTreatments, useSessions } from "@/hooks/useDatabase";
import { Patient, TherapySession } from "@/lib/database";
import { TreatmentCategory } from "./TreatmentCategoryManager";
import { useToast } from "@/hooks/use-toast";

interface AdvancedAddTreatmentFormProps {
  patient: Patient;
  onClose: () => void;
}

export const AdvancedAddTreatmentForm = ({ patient, onClose }: AdvancedAddTreatmentFormProps) => {
  const [formData, setFormData] = useState({
    sessionId: "",
    categoryId: "",
    customType: "",
    description: "",
    images: [] as string[]
  });
  
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [completedSessions, setCompletedSessions] = useState<TherapySession[]>([]);
  const { addTreatment } = useTreatments();
  const { sessions } = useSessions();
  const { toast } = useToast();

  useEffect(() => {
    // Load categories
    const stored = localStorage.getItem('neutro_treatment_categories');
    if (stored) {
      setCategories(JSON.parse(stored));
    }

    // Filter completed sessions for this patient
    const patientCompletedSessions = sessions.filter(s => 
      s.patient_id === patient.id && s.status === 'odrađena'
    );
    setCompletedSessions(patientCompletedSessions);
  }, [sessions, patient.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sessionId) {
      toast({
        title: "Greška",
        description: "Morate odabrati sesiju",
        variant: "destructive"
      });
      return;
    }

    const selectedSession = completedSessions.find(s => s.id === formData.sessionId);
    if (!selectedSession) {
      toast({
        title: "Greška",
        description: "Odabrana sesija nije pronađena",
        variant: "destructive"
      });
      return;
    }

    let treatmentType = "";
    if (formData.categoryId) {
      const category = categories.find(c => c.id === formData.categoryId);
      treatmentType = category?.name || "";
    } else {
      treatmentType = formData.customType;
    }

    if (!treatmentType) {
      toast({
        title: "Greška",
        description: "Morate odabrati kategoriju ili uneti tip tretmana",
        variant: "destructive"
      });
      return;
    }

    addTreatment({
      patient_id: patient.id,
      session_id: formData.sessionId,
      date: selectedSession.date,
      type: treatmentType,
      description: formData.description,
      category_id: formData.categoryId || undefined,
      images: formData.images.length > 0 ? formData.images : undefined
    });

    toast({
      title: "Tretman zabeležen",
      description: "Tretman je uspešno povezan sa sesijom"
    });
    
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Dodaj tretman</h2>
            <p className="text-sm text-slate-500">za {patient.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {completedSessions.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Nema završenih sesija za ovog pacijenta. Prvo morate da završite sesiju da biste mogli da dodate tretman.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="session">Povezana sesija *</Label>
            <Select 
              value={formData.sessionId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, sessionId: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Odaberi završenu sesiju" />
              </SelectTrigger>
              <SelectContent>
                {completedSessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(session.date).toLocaleDateString('sr-RS')} 
                      {session.date.includes('T') && ` - ${new Date(session.date).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}`}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Kategorija tretmana</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value, customType: "" }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Odaberi kategoriju ili ostavi prazno za custom tip" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                      {category.description && (
                        <span className="text-xs text-slate-500">- {category.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <Badge 
                className="mt-2" 
                style={{ backgroundColor: selectedCategory.color, color: 'white' }}
              >
                {selectedCategory.name}
              </Badge>
            )}
          </div>

          {!formData.categoryId && (
            <div>
              <Label htmlFor="customType">Custom tip tretmana *</Label>
              <Input
                id="customType"
                value={formData.customType}
                onChange={(e) => setFormData(prev => ({ ...prev, customType: e.target.value }))}
                placeholder="Unesite tip tretmana"
                required={!formData.categoryId}
              />
            </div>
          )}

          <div>
            <Label htmlFor="description">Opis tretmana *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detaljno opišite tretman koji je izvršen..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="images">Slike tretmana</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Dodaj slike
                </Button>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Tretman ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              Otkaži
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={completedSessions.length === 0}
            >
              Zabeleži tretman
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};