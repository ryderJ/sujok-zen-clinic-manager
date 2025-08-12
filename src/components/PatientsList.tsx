
import { useState } from "react";
import { Plus, Search, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePatients, useSessions } from "@/hooks/useDatabase";
import { Patient } from "@/lib/database";

interface PatientsListProps {
  onPatientSelect: (patient: Patient) => void;
  onAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeleteConfirm: (action: () => void) => void;
  fullView?: boolean;
}

export const PatientsList = ({ 
  onPatientSelect, 
  onAddPatient, 
  onEditPatient, 
  onDeleteConfirm, 
  fullView = false 
}: PatientsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { patients, loading, updatePatient, deletePatient } = usePatients();
  const { sessions } = useSessions();
  
  const filteredPatients = patients
    .filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, 'sr', { sensitivity: 'base' }));

  const activePatients = filteredPatients.filter(p => p.is_active);
  const inactivePatients = filteredPatients.filter(p => !p.is_active);

  const handleDeletePatient = (patientId: string) => {
    const deleteAction = () => {
      deletePatient(patientId);
    };
    onDeleteConfirm(deleteAction);
  };

  const togglePatientStatus = (patient: Patient) => {
    updatePatient(patient.id, { is_active: !patient.is_active });
  };

  const getPatientSessionCount = (patientId: string) => {
    return sessions.filter(session => 
      session.patient_id === patientId && session.status === 'odrađena'
    ).length;
  };

  const getLastVisit = (patientId: string) => {
    const patientSessions = sessions
      .filter(session => session.patient_id === patientId && session.status === 'odrađena')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return patientSessions.length > 0 ? patientSessions[0].date : null;
  };

  const highlightedPatients = activePatients
    .map(p => ({ p, last: getLastVisit(p.id) }))
    .sort((a, b) => {
      const ad = a.last ? new Date(a.last).getTime() : 0;
      const bd = b.last ? new Date(b.last).getTime() : 0;
      return bd - ad;
    })
    .map(x => x.p);

  const renderPatientCard = (patient: Patient) => {
    const sessionCount = getPatientSessionCount(patient.id);
    const lastVisit = getLastVisit(patient.id);

    return (
      <div
        key={patient.id}
        className="p-4 rounded-xl border border-slate-200 hover:border-primary/30 hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => onPatientSelect(patient)}
          >
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="font-semibold text-slate-800">{patient.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                patient.is_active 
                  ? "bg-green-100 text-green-800" 
                  : "bg-slate-100 text-slate-600"
              }`}>
                {patient.is_active ? "Aktivan" : "Neaktivan"}
              </span>
            </div>
            <div className="text-sm text-slate-500 space-y-1">
              <p>Rođen: {new Date(patient.date_of_birth).toLocaleDateString('sr-RS')}</p>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {patient.phone}
                </span>
                {patient.email && (
                  <span className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {patient.email}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right mr-4">
              <div className="bg-primary/15 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
                {sessionCount} sesija
              </div>
              {lastVisit && (
                <p className="text-xs text-slate-500">
                  Poslednja poseta: {new Date(lastVisit).toLocaleDateString('sr-RS')}
                </p>
              )}
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Switch
                checked={patient.is_active}
                onCheckedChange={() => togglePatientStatus(patient)}
              />
              <span className="text-xs text-slate-500">Status</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditPatient(patient);
              }}
              className="text-primary hover:text-primary/90 hover:bg-primary/10"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePatient(patient.id);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200">
        <div className="flex items-center justify-center py-8">
          <div className="text-slate-500">Učitavam pacijente...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Pacijenti</h2>
        <Button 
          onClick={onAddPatient}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-9 px-3 md:h-10 md:px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj pacijenta
        </Button>
      </div>

      {fullView ? (
        <>
          <div className="mb-6 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Pretraži pacijente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-200"
            />
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-slate-700 flex items-center">
              Aktivni pacijenti 
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {activePatients.length}
              </span>
            </h3>
            {activePatients.length > 0 ? (
              activePatients.slice(0, undefined).map(renderPatientCard)
            ) : (
              <p className="text-slate-500 text-center py-4">Nema aktivnih pacijenata</p>
            )}
          </div>

          {(inactivePatients.length > 0) && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="font-medium text-slate-700 flex items-center">
                Neaktivni pacijenti 
                <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                  {inactivePatients.length}
                </span>
              </h3>
              {inactivePatients.length > 0 ? (
                inactivePatients.slice(0, undefined).map(renderPatientCard)
              ) : (
                <p className="text-slate-500 text-center py-4">Nema neaktivnih pacijenata</p>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-4 mb-2">
            <h3 className="font-medium text-slate-700">Istaknuti pacijenti</h3>
            {highlightedPatients.length > 0 ? (
              highlightedPatients.slice(0, 6).map(renderPatientCard)
            ) : (
              <p className="text-slate-500 text-center py-4">Nema pacijenata za prikaz</p>
            )}
          </div>

          {(activePatients.length + inactivePatients.length) > 6 && (
            <div className="mt-2 text-center">
              <Button variant="ghost" className="text-primary hover:text-primary/90">
                Prikaži sve pacijente ({activePatients.length + inactivePatients.length})
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
