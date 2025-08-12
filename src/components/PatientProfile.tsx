
import { ArrowLeft, Plus, Download, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatients, useSessions, useTreatments } from "@/hooks/useDatabase";
import { Patient, TherapySession, Treatment, TreatmentCategory, db } from "@/lib/database";
import { PDFExport } from "./PDFExport";
import { EditSessionForm } from "./EditSessionForm";
import { TreatmentDetailView } from "./TreatmentDetailView";
import { PatientAgeDisplay } from "./PatientAgeDisplay";
import { useState, useEffect } from "react";

interface PatientProfileProps {
  patient: Patient;
  onBack: () => void;
  onAddTreatment: () => void;
  onEditPatient: () => void;
  onDeleteConfirm: (action: () => void) => void;
}

export const PatientProfile = ({ 
  patient, 
  onBack, 
  onAddTreatment, 
  onEditPatient, 
  onDeleteConfirm 
}: PatientProfileProps) => {
  const { sessions, updateSession } = useSessions();
  const { treatments, deleteTreatment } = useTreatments();
  const [editingSession, setEditingSession] = useState<TherapySession | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);

  // Filter sessions and treatments for this patient
  const patientSessions = sessions.filter(session => session.patient_id === patient.id);
  const patientTreatments = treatments.filter(treatment => treatment.patient_id === patient.id);

  // Load categories
  useEffect(() => {
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
    
    const handleStorageChange = () => {
      loadCategories();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleDeleteTreatment = (treatmentId: string) => {
    const deleteAction = () => {
      deleteTreatment(treatmentId);
    };
    onDeleteConfirm(deleteAction);
  };

  const handleEditSession = (sessionData: Partial<TherapySession>) => {
    if (editingSession) {
      updateSession(editingSession.id, sessionData);
      setEditingSession(null);
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case "odrađena":
        return "bg-green-100 text-green-800 border-green-200";
      case "zakazana":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "otkazana":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const completedSessions = patientSessions.filter(s => s.status === "odrađena").length;
  const totalSessions = patientSessions.length;
  const cancelledSessions = patientSessions.filter(s => s.status === "otkazana").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nazad na pacijente
        </Button>
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {patient.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
              <div className="flex items-center space-x-4">
                <p className="text-slate-500">Pacijent od {new Date(patient.created_at).getFullYear()}</p>
                <PatientAgeDisplay dateOfBirth={patient.date_of_birth} />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  patient.is_active 
                    ? "bg-green-100 text-green-800" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {patient.is_active ? "Aktivan" : "Neaktivan"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <PDFExport 
              patient={patient}
              sessions={patientSessions}
              treatments={patientTreatments}
            />
            <Button 
              onClick={onEditPatient}
              variant="outline" 
              className="rounded-xl text-primary hover:text-primary/90"
            >
              <Edit className="w-4 h-4 mr-2" />
              Izmeni
            </Button>
            {patient.is_active && (
              <Button 
                onClick={onAddTreatment}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj tretman
              </Button>
            )}
          </div>
        </div>

        {/* Patient Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Datum rođenja</h3>
            <p className="text-slate-800">{new Date(patient.date_of_birth).toLocaleDateString('sr-RS')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Telefon</h3>
            <p className="text-slate-800">{patient.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Email</h3>
            <p className="text-slate-800">{patient.email || 'Nije unet'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Ukupno sesija</h3>
            <p className="text-slate-800 font-semibold">{completedSessions}</p>
          </div>
        </div>
      </div>

      {/* Patient Statistics */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Statistike pacijenta</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-primary/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{totalSessions}</p>
                <p className="text-sm text-slate-600">Ukupno sesija</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{completedSessions}</p>
                <p className="text-sm text-slate-600">Završene sesije</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">X</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{cancelledSessions}</p>
                <p className="text-sm text-slate-600">Otkazane sesije</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-bold text-sm">%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">
                  {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%
                </p>
                <p className="text-sm text-slate-600">Stopa završenih</p>
              </div>
            </div>
          </div>
        </div>

        {patientSessions.length > 0 && (
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Hronologija sesija</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {patientSessions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-slate-800">
                        {new Date(session.date).toLocaleDateString('sr-RS')}
                      </span>
                      {session.notes && (
                        <span className="text-sm text-slate-500">{session.notes}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSessionStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSession(session)}
                        className="text-primary hover:text-primary/90 hover:bg-primary/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Health Notes */}
      {patient.notes && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Zdravstveno stanje i napomene</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-slate-700">{patient.notes}</p>
          </div>
        </div>
      )}

      {/* Treatment History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Istorija tretmana</h2>
          <div className="bg-primary/15 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {patientTreatments.length} tretmana
          </div>
        </div>

        {patientTreatments.length > 0 ? (
          <div className="space-y-6">
            {patientTreatments.map((treatment, index) => (
              <div key={treatment.id} className="border-l-4 border-primary/30 pl-6 pb-6 relative">
                {index < patientTreatments.length - 1 && (
                  <div className="absolute left-0 top-8 w-px h-full bg-slate-200"></div>
                )}
                
                <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                
                <div 
                  className="bg-slate-50 rounded-xl p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => setSelectedTreatment(treatment)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-slate-800">
                        {new Date(treatment.date).toLocaleDateString('sr-RS')}
                      </span>
                      <span className="text-sm text-slate-500">
                        {treatment.type}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTreatment(treatment.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-2">{treatment.description}</p>
                  <p className="text-xs text-slate-400 mt-2">Kliknite za detalje</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">Nema zabeleženih tretmana za ovog pacijenta</p>
        )}
      </div>

      {editingSession && (
        <EditSessionForm
          session={editingSession}
          onSave={handleEditSession}
          onCancel={() => setEditingSession(null)}
        />
      )}

      {selectedTreatment && (
        <TreatmentDetailView
          treatment={selectedTreatment}
          categories={categories}
          onClose={() => setSelectedTreatment(null)}
        />
      )}
    </div>
  );
};
