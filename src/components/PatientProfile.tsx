import { ArrowLeft, Plus, Download, Camera, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportPatientToPDF } from "@/utils/pdfExport";
import { useTherapySessions } from "@/hooks/useTherapySessions";
import { useTreatments, useDeleteTreatment } from "@/hooks/useTreatments";
import { Patient } from "@/lib/supabase";

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
  const { data: allSessions = [] } = useTherapySessions();
  const { data: treatments = [] } = useTreatments(patient.id);
  const deleteTreatment = useDeleteTreatment();

  // Filter sessions for this patient
  const patientSessions = allSessions.filter(session => session.patient_id === patient.id);
  
  const handleDeleteTreatment = (treatmentId: string) => {
    const deleteAction = () => {
      deleteTreatment.mutate(treatmentId);
    };
    onDeleteConfirm(deleteAction);
  };

  const handleExportPDF = () => {
    exportPatientToPDF(patient, treatments);
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case "odrađena":
        return "bg-green-100 text-green-800 border-green-200";
      case "zakazana":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "propuštena":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const completedSessions = patientSessions.filter(s => s.status === "odrađena").length;
  const totalSessions = patientSessions.length;

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
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {patient.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
              <div className="flex items-center space-x-2">
                <p className="text-slate-500">Pacijent od {new Date(patient.created_at).getFullYear()}</p>
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
            <Button 
              onClick={handleExportPDF}
              variant="outline" 
              className="rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Izvezi PDF
            </Button>
            <Button 
              onClick={onEditPatient}
              variant="outline" 
              className="rounded-xl text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Izmeni
            </Button>
            {patient.is_active && (
              <Button 
                onClick={onAddTreatment}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalSessions}</p>
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
                      <span className="text-slate-600">{session.time}</span>
                      <span className="text-sm text-slate-500">{session.type}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSessionStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Health Conditions */}
      {patient.conditions && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Zdravstveno stanje i napomene</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-slate-700">{patient.conditions}</p>
          </div>
        </div>
      )}

      {/* Treatment History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Istorija tretmana</h2>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {treatments.length} tretmana
          </div>
        </div>

        {treatments.length > 0 ? (
          <div className="space-y-6">
            {treatments.map((treatment, index) => (
              <div key={treatment.id} className="border-l-4 border-blue-200 pl-6 pb-6 relative">
                {index < treatments.length - 1 && (
                  <div className="absolute left-0 top-8 w-px h-full bg-slate-200"></div>
                )}
                
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-slate-800">
                        {new Date(treatment.date).toLocaleDateString('sr-RS')}
                      </span>
                      <span className="text-sm text-slate-500">
                        {treatment.duration} minuta
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTreatment(treatment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deleteTreatment.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-slate-800 mb-2">{treatment.description}</h3>
                  {treatment.notes && (
                    <p className="text-sm text-slate-600 mb-4">{treatment.notes}</p>
                  )}
                  
                  {treatment.photos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                        <Camera className="w-4 h-4 mr-1" />
                        Fotografije ({treatment.photos.length})
                      </h4>
                      <div className="flex space-x-2">
                        {treatment.photos.map((photo, photoIndex) => (
                          <div key={photoIndex} className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <Camera className="w-6 h-6 text-blue-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">Nema zabeleženih tretmana za ovog pacijenta</p>
        )}
      </div>
    </div>
  );
};