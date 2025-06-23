
import { ArrowLeft, Plus, Download, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientProfileProps {
  patient: any;
  onBack: () => void;
  onAddTreatment: () => void;
}

// Mock treatment history
const mockTreatments = [
  {
    id: 1,
    date: "2024-06-20",
    description: "Su Jok hand therapy session focusing on digestive points",
    photos: ["photo-1618160702438-9b02ab6515c9"],
    notes: "Patient reported significant improvement in digestive issues. Continued treatment recommended.",
    duration: 45
  },
  {
    id: 2,
    date: "2024-06-15",
    description: "Acupressure session for stress relief and anxiety management",
    photos: ["photo-1472396961693-142e6e269027", "photo-1493962853295-0fd70327578a"],
    notes: "Applied pressure to key stress-relief points. Patient felt more relaxed after session.",
    duration: 60
  },
  {
    id: 3,
    date: "2024-06-10",
    description: "Initial consultation and assessment",
    photos: [],
    notes: "Comprehensive assessment completed. Identified primary areas of concern: anxiety and digestive issues.",
    duration: 90
  }
];

export const PatientProfile = ({ patient, onBack, onAddTreatment }: PatientProfileProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
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
              <p className="text-slate-500">Patient since {new Date(patient.lastVisit).getFullYear()}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button 
              onClick={onAddTreatment}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Treatment
            </Button>
          </div>
        </div>

        {/* Patient Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Date of Birth</h3>
            <p className="text-slate-800">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Phone</h3>
            <p className="text-slate-800">{patient.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Email</h3>
            <p className="text-slate-800">{patient.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total Sessions</h3>
            <p className="text-slate-800 font-semibold">{patient.completedTherapies}</p>
          </div>
        </div>
      </div>

      {/* Health Conditions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Health Conditions & Notes</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-slate-700">{patient.conditions}</p>
        </div>
      </div>

      {/* Treatment History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Treatment History</h2>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {mockTreatments.length} treatments
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
                      {new Date(treatment.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-slate-500">
                      {treatment.duration} minutes
                    </span>
                  </div>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                
                <h3 className="font-medium text-slate-800 mb-2">{treatment.description}</h3>
                <p className="text-sm text-slate-600 mb-4">{treatment.notes}</p>
                
                {treatment.photos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                      <Camera className="w-4 h-4 mr-1" />
                      Photos ({treatment.photos.length})
                    </h4>
                    <div className="flex space-x-2">
                      {treatment.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/${photo}?w=150&h=150&fit=crop&auto=format`}
                            alt={`Treatment photo ${photoIndex + 1}`}
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
