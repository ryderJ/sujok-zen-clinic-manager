import { useState } from "react";
import { X, Calendar, Tag, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Treatment } from "@/lib/database";
import { TreatmentCategory } from "./TreatmentCategoryManager";

interface TreatmentDetailViewProps {
  treatment: Treatment;
  categories: TreatmentCategory[];
  onClose: () => void;
}

export const TreatmentDetailView = ({ treatment, categories, onClose }: TreatmentDetailViewProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const category = categories.find(c => c.id === treatment.category_id);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Detalji tretmana</h2>
            <p className="text-sm text-slate-500">
              {new Date(treatment.date).toLocaleDateString('sr-RS')}
              {treatment.date.includes('T') && ` - ${new Date(treatment.date).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Treatment Type */}
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-slate-500" />
            <div>
              <p className="font-medium text-slate-800">Tip tretmana</p>
              <div className="flex items-center gap-2 mt-1">
                {category ? (
                  <Badge style={{ backgroundColor: category.color, color: 'white' }}>
                    {treatment.type}
                  </Badge>
                ) : (
                  <Badge variant="outline">{treatment.type}</Badge>
                )}
                {category?.description && (
                  <span className="text-sm text-slate-600">{category.description}</span>
                )}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <p className="font-medium text-slate-800">Datum i vreme</p>
              <p className="text-slate-600">
                {new Date(treatment.date).toLocaleDateString('sr-RS', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                {treatment.date.includes('T') && (
                  <span> u {new Date(treatment.date).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-slate-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-slate-800 mb-2">Opis tretmana</p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 whitespace-pre-wrap">{treatment.description}</p>
              </div>
            </div>
          </div>

          {/* Images */}
          {treatment.images && treatment.images.length > 0 && (
            <div className="flex items-start gap-3">
              <ImageIcon className="w-5 h-5 text-slate-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-slate-800 mb-3">Slike tretmana</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {treatment.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Tretman ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImageIndex(index)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Tretman kreiran: {new Date(treatment.created_at).toLocaleDateString('sr-RS')} u {new Date(treatment.created_at).toLocaleTimeString('sr-RS')}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={onClose}>
            Zatvori
          </Button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && treatment.images && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-60">
          <div className="relative max-w-4xl max-h-4xl">
            <img 
              src={treatment.images[selectedImageIndex]} 
              alt={`Tretman ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};