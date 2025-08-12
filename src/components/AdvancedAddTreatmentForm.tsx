import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTreatments, useSessions } from "@/hooks/useDatabase";
import { Patient, TherapySession, TreatmentCategory, db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

interface AdvancedAddTreatmentFormProps {
  patient: Patient;
  onClose: () => void;
}

export const AdvancedAddTreatmentForm = ({ patient, onClose }: AdvancedAddTreatmentFormProps) => {
  const [formData, setFormData] = useState({
    sessionId: "",
    categoryId: "",
    description: "",
    duration_minutes: 60,
    images: [] as string[]
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [completedSessions, setCompletedSessions] = useState<TherapySession[]>([]);
  const { addTreatment } = useTreatments();
  const { sessions } = useSessions();
  const { toast } = useToast();

  useEffect(() => {
    // Load categories using the database
    const loadCategories = async () => {
      try {
        const categoriesData = await db.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      }
    };
    loadCategories();

    // Filter completed sessions for this patient
    const patientCompletedSessions = sessions.filter(s => 
      s.patient_id === patient.id && s.status === 'odrađena'
    );
    setCompletedSessions(patientCompletedSessions);
  }, [sessions, patient.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sessionId) {
      toast({
        title: "Greška",
        description: "Morate odabrati sesiju",
        variant: "destructive"
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        title: "Greška",
        description: "Morate odabrati kategoriju tretmana",
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

    const category = categories.find(c => c.id === formData.categoryId);
    const treatmentType = category?.name || "";

    if (!treatmentType) {
      toast({
        title: "Greška",
        description: "Morate odabrati kategoriju tretmana",
        variant: "destructive"
      });
      return;
    }

    try {
      await addTreatment({
        patient_id: patient.id,
        session_id: formData.sessionId,
        date: selectedSession.date,
        type: treatmentType,
        description: formData.description,
        category_id: formData.categoryId,
        duration_minutes: formData.duration_minutes
      }, imageFiles);

      toast({
        title: "Tretman zabeležen",
        description: "Tretman je uspešno povezan sa sesijom"
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Greška",
        description: "Neuspešno dodavanje tretmana",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArr = Array.from(files);
    setImageFiles(prev => [...prev, ...filesArr]);

    filesArr.forEach(file => {
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
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Dodaj tretman</h2>
            <p className="text-sm text-muted-foreground">za {patient.name}</p>
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
            <Label htmlFor="category">Kategorija tretmana *</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Odaberi kategoriju tretmana" />
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
                        <span className="text-xs text-muted-foreground">- {category.description}</span>
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

          <div>
            <Label htmlFor="duration">Trajanje tretmana (minuti) *</Label>
            <Input
              id="duration"
              type="number"
              min="5"
              max="240"
              step="5"
              value={formData.duration_minutes}
              onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
              className="rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Opis tretmana *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detaljno opišite tretman koji je izvršen..."
              className="w-full px-3 py-2 rounded-xl border border-input resize-none bg-background text-foreground"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="images">Slike tretmana</Label>
            <div className="space-y-4">
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full"
              />
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Tretman ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(image, '_blank')}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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
              className="flex-1"
              disabled={completedSessions.length === 0 || !formData.categoryId}
            >
              Zabeleži tretman
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};