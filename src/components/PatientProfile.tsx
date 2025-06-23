import { ArrowLeft, Plus, Download, Camera, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportPatientToPDF } from "@/utils/pdfExport";

interface PatientProfileProps {
  patient: any;
  onBack: () => void;
  onAddTreatment: () => void;
  onEditPatient: () => void;
  onDeleteConfirm: (action: () => void) => void;
}

// Mock treatment history
const mockTreatments = [
  {
    id: 1,
    date: "2024-06-20",
    description: "Su Jok terapija ruku fokusirana na tačke za varenje",
    photos: ["photo-1618160702438-9b02ab6515c9"],
    notes: "Pacijent je izvestio o značajnom poboljšanju problema sa varenjem. Preporučuje se nastavak tretmana.",
    duration: 45
  },
  {
    id: 2,
    date: "2024-06-15",
    description: "Akupresura sesija za smanjenje stresa i upravljanje anksioznošću",
    photos: ["photo-1472396961693-142e6e269027", "photo-1493962853295-0fd70327578a"],
    notes: "Primenjen pritisak na ključne tačke za smanjenje stresa. Pacijent se osećao opuštenije nakon sesije.",
    duration: 60
  },
  {
    id: 3,
    date: "2024-06-10",
    description: "Inicijalna konsultacija i procena",
    photos: [],
    notes: "Kompletna procena završena. Identifikovane su primarne oblasti zabrinutosti: anksioznost i problemi sa varenjem.",
    duration: 90
  }
];

// Mock therapy sessions for this patient
const mockPatientSessions = [
  { id: 1, date: "2024-06-22", time: "10:00", status: "odrađena" },
  { id: 2, date: "2024-06-20", time: "14:30", status: "odrađena" },
  { id: 3, date: "2024-06-25", time: "09:00", status: "zakazana" },
  { id: 4, date: "2024-06-15", time: "11:00", status: "odrađena" },
  { id: 5, date: "2024-06-12", time: "16:00", status: "propuštena" },
];

export const PatientProfile = ({ patient, onBack, onAddTreatment, onEditPatient, onDeleteConfirm }: PatientProfileProps) => {
  const handleDeleteTreatment = (treatmentId: number) => {
    const deleteAction = () => {
      console.log("Obrisao tretman:", treatmentId);
    };
    onDeleteConfirm(deleteAction);
  };

  const handleExportPDF = () => {
    exportPatientToPDF(patient, mockTreatments);
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

  const completedSessions = mockPatientSessions.filter(s => s.status === "odrađena").length;
  const totalSessions = mockPatientSessions.length;

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
                <p className="text-slate-500">Pacijent od {new Date(patient.lastVisit).getFullYear()}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  patient.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {patient.isActive ? "Aktivan" : "Neaktivan"}
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
            {patient.isActive && (
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
            <p className="text-slate-800">{new Date(patient.dateOfBirth).toLocaleDateString('sr-RS')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Telefon</h3>
            <p className="text-slate-800">{patient.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Email</h3>
            <p className="text-slate-800">{patient.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Ukupno sesija</h3>
            <p className="text-slate-800 font-semibold">{patient.completedTherapies}</p>
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
                  {Math.round((completedSessions / totalSessions) * 100)}%
                </p>
                <p className="text-sm text-slate-600">Stopa završenih</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-slate-700 mb-3">Hronologija sesija</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {mockPatientSessions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-slate-800">
                      {new Date(session.date).toLocaleDateString('sr-RS')}
                    </span>
                    <span className="text-slate-600">{session.time}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSessionStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Health Conditions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Zdravstveno stanje i napomene</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-slate-700">{patient.conditions}</p>
        </div>
      </div>

      {/* Treatment History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Istorija tretmana</h2>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {mockTreatments.length} tretmana
          </div>
        </div>

        <div className="space-y-6">
          {mockTreatments.map((treatment, index) => (
            <div key={treatment.id} className="border-l-4 border-blue-200 pl-6 pb-6 relative">
              {index < mockTreatments.length - 1 && (
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
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-medium text-slate-800 mb-2">{treatment.description}</h3>
                <p className="text-sm text-slate-600 mb-4">{treatment.notes}</p>
                
                {treatment.photos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                      <Camera className="w-4 h-4 mr-1" />
                      Fotografije ({treatment.photos.length})
                    </h4>
                    <div className="flex space-x-2">
                      {treatment.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/${photo}?w=150&h=150&fit=crop&auto=format`}
                            alt={`Fotografija tretmana ${photoIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
