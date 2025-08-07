import { useState } from "react";
import { X, Calendar, FileText, Image as ImageIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Treatment } from "@/lib/database";
import { TreatmentCategory } from "./TreatmentCategoryManager";
import { EditTreatmentForm } from "./EditTreatmentForm";
import { useTreatments } from "@/hooks/useDatabase";

interface TreatmentDetailViewProps {
  treatment: Treatment;
  categories: TreatmentCategory[];
  onClose: () => void;
}

export const TreatmentDetailView = ({ treatment, categories, onClose }: TreatmentDetailViewProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { updateTreatment } = useTreatments();

  const handleSave = async (treatmentData: Partial<Treatment>) => {
    try {
      await updateTreatment(treatment.id, treatmentData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating treatment:', error);
    }
  };

  const category = categories.find(c => c.id === treatment.category_id);

  if (isEditing) {
    return (
      <EditTreatmentForm
        treatment={treatment}
        onSave={handleSave}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Detalji tretmana</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Izmeni
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-600">Datum</span>
                </div>
                <p className="text-lg font-semibold text-slate-800">
                  {new Date(treatment.date).toLocaleDateString('sr-RS')}
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-600">Tip tretmana</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-slate-800">{treatment.type}</p>
                  {category && (
                    <Badge 
                      style={{ backgroundColor: category.color, color: 'white' }}
                      className="text-xs"
                    >
                      {category.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Opis tretmana</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {treatment.description}
              </p>
            </div>

            {/* Images */}
            {treatment.images && treatment.images.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-800">Slike tretmana</h3>
                  <span className="text-sm text-slate-500">({treatment.images.length})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {treatment.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative cursor-pointer group"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img 
                        src={image} 
                        alt={`Tretman ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Dodatne informacije</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Kreiran:</span>
                  <span className="ml-2 text-slate-700">
                    {new Date(treatment.created_at).toLocaleDateString('sr-RS')} u {new Date(treatment.created_at).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {treatment.session_id && (
                  <div>
                    <span className="text-slate-500">ID sesije:</span>
                    <span className="ml-2 text-slate-700 font-mono text-xs">{treatment.session_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && treatment.images && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-60"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img 
              src={treatment.images[selectedImageIndex]} 
              alt={`Tretman ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Navigation */}
            {treatment.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-3 py-2">
                <span className="text-white text-sm">
                  {selectedImageIndex + 1} / {treatment.images.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};