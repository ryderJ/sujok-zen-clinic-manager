
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardStats } from "@/components/DashboardStats";
import { PatientsList } from "@/components/PatientsList";
import { TherapyCalendar } from "@/components/TherapyCalendar";
import { PatientProfile } from "@/components/PatientProfile";
import { AddPatientForm } from "@/components/AddPatientForm";
import { AddTreatmentForm } from "@/components/AddTreatmentForm";
import { ScheduleTherapyForm } from "@/components/ScheduleTherapyForm";
import { EditPatientForm } from "@/components/EditPatientForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [showScheduleTherapy, setShowScheduleTherapy] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleDeleteConfirm = (action: () => void) => {
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Su Jok Doktor</h1>
              <p className="text-slate-600">Upravljajte svojom terapeutskom praksom sa lakoćom</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <PatientsList 
                  onPatientSelect={setSelectedPatient}
                  onAddPatient={() => setShowAddPatient(true)}
                  onEditPatient={(patient) => {
                    setSelectedPatient(patient);
                    setShowEditPatient(true);
                  }}
                  onDeleteConfirm={handleDeleteConfirm}
                />
                <TherapyCalendar 
                  onScheduleTherapy={() => setShowScheduleTherapy(true)}
                  onDeleteConfirm={handleDeleteConfirm}
                />
              </div>
              <div>
                <DashboardStats />
              </div>
            </div>
          </div>
        );
      case "patients":
        return selectedPatient ? (
          <PatientProfile 
            patient={selectedPatient} 
            onBack={() => setSelectedPatient(null)}
            onAddTreatment={() => setShowAddTreatment(true)}
            onEditPatient={() => setShowEditPatient(true)}
            onDeleteConfirm={handleDeleteConfirm}
          />
        ) : (
          <PatientsList 
            onPatientSelect={setSelectedPatient}
            onAddPatient={() => setShowAddPatient(true)}
            onEditPatient={(patient) => {
              setSelectedPatient(patient);
              setShowEditPatient(true);
            }}
            onDeleteConfirm={handleDeleteConfirm}
            fullView={true}
          />
        );
      case "therapies":
        return <TherapyCalendar onScheduleTherapy={() => setShowScheduleTherapy(true)} onDeleteConfirm={handleDeleteConfirm} fullView={true} />;
      case "statistics":
        return <DashboardStats fullView={true} />;
      default:
        return <div>Stranica nije pronađena</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 p-8">
        {renderMainContent()}
      </main>

      {/* Modals */}
      {showAddPatient && (
        <AddPatientForm onClose={() => setShowAddPatient(false)} />
      )}
      
      {showEditPatient && selectedPatient && (
        <EditPatientForm 
          patient={selectedPatient}
          onClose={() => setShowEditPatient(false)}
          onSave={(updatedPatient) => {
            setSelectedPatient(updatedPatient);
            setShowEditPatient(false);
          }}
        />
      )}
      
      {showAddTreatment && selectedPatient && (
        <AddTreatmentForm 
          patient={selectedPatient}
          onClose={() => setShowAddTreatment(false)} 
        />
      )}
      
      {showScheduleTherapy && (
        <ScheduleTherapyForm onClose={() => setShowScheduleTherapy(false)} />
      )}

      {showConfirmDialog && confirmAction && (
        <ConfirmDialog 
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={() => {
            confirmAction();
            setShowConfirmDialog(false);
          }}
        />
      )}
    </div>
  );
};

export default Index;
