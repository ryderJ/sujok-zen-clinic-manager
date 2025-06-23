
import { useState } from "react";
import { Plus, Search, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PatientsListProps {
  onPatientSelect: (patient: any) => void;
  onAddPatient: () => void;
  onEditPatient: (patient: any) => void;
  onDeleteConfirm: (action: () => void) => void;
  fullView?: boolean;
}

// Mock data - in a real app this would come from local storage or database
const mockPatients = [
  {
    id: 1,
    name: "Marija Rodríguez",
    dateOfBirth: "1985-06-15",
    phone: "+381 60 123 4567",
    email: "marija.r@email.com",
    completedTherapies: 12,
    lastVisit: "2024-06-15",
    conditions: "Hronični bol u leđima, upravljanje stresom"
  },
  {
    id: 2,
    name: "Jovan Čen",
    dateOfBirth: "1978-11-22",
    phone: "+381 60 987 6543",
    email: "j.chen@email.com",
    completedTherapies: 8,
    lastVisit: "2024-06-18",
    conditions: "Migrena, nesanica"
  },
  {
    id: 3,
    name: "Sara Villiams",
    dateOfBirth: "1992-03-08",
    phone: "+381 60 456 7890",
    email: "sara.w@email.com",
    completedTherapies: 15,
    lastVisit: "2024-06-20",
    conditions: "Anksioznost, problemi sa varenjem"
  }
];

export const PatientsList = ({ onPatientSelect, onAddPatient, onEditPatient, onDeleteConfirm, fullView = false }: PatientsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePatient = (patientId: number) => {
    const deleteAction = () => {
      // Remove from localStorage (in real app)
      console.log("Deleting patient:", patientId);
    };
    onDeleteConfirm(deleteAction);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Pacijenti</h2>
        <Button 
          onClick={onAddPatient}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj pacijenta
        </Button>
      </div>

      {fullView && (
        <div className="mb-6 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Pretraži pacijente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-slate-200"
          />
        </div>
      )}

      <div className="space-y-4">
        {filteredPatients.slice(0, fullView ? undefined : 5).map((patient) => (
          <div
            key={patient.id}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onPatientSelect(patient)}
              >
                <h3 className="font-semibold text-slate-800 mb-1">{patient.name}</h3>
                <div className="text-sm text-slate-500 space-y-1">
                  <p>Rođen: {new Date(patient.dateOfBirth).toLocaleDateString('sr-RS')}</p>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {patient.phone}
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {patient.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right mr-4">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {patient.completedTherapies} sesija
                  </div>
                  <p className="text-xs text-slate-500">Poslednja poseta: {new Date(patient.lastVisit).toLocaleDateString('sr-RS')}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditPatient(patient)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePatient(patient.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!fullView && filteredPatients.length > 5 && (
        <div className="mt-4 text-center">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            Prikaži sve pacijente ({filteredPatients.length})
          </Button>
        </div>
      )}
    </div>
  );
};
