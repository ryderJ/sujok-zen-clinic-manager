
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardStats } from "@/components/DashboardStats";
import { PatientsList } from "@/components/PatientsList";
import { TherapyCalendar } from "@/components/TherapyCalendar";
import { PatientProfile } from "@/components/PatientProfile";
import { AddPatientForm } from "@/components/AddPatientForm";
import { AdvancedAddTreatmentForm } from "@/components/AdvancedAddTreatmentForm";
import { BackupManager } from "@/components/BackupManager";
import { TreatmentCategoryManager } from "@/components/TreatmentCategoryManager";
import { ScheduleTherapyForm } from "@/components/ScheduleTherapyForm";
import { EditPatientForm } from "@/components/EditPatientForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Patient } from "@/lib/database";

// Mobile UI
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [showScheduleTherapy, setShowScheduleTherapy] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

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
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Neutro Admin</h1>
              <p className="text-slate-600">Goran Topalovic - Upravljanje terapeutskom praksom</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <PatientsList 
                  onPatientSelect={(patient) => {
                    setSelectedPatient(patient);
                    setActiveView('patients');
                  }}
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
        return (
          <TherapyCalendar 
            onScheduleTherapy={() => setShowScheduleTherapy(true)} 
            onDeleteConfirm={handleDeleteConfirm} 
            fullView={true} 
          />
        );
      case "categories":
        return <TreatmentCategoryManager />;
      case "backup":
        return <BackupManager />;
      case "statistics":
        return <DashboardStats fullView={true} />;
      default:
        return <div>Stranica nije pronađena</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full overflow-x-hidden">
      {/* Mobile header with drawer menu */}
      <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center h-14 px-4 gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Otvori meni">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[85vw] max-w-[320px] z-[60]">
              <Sidebar activeView={activeView} onViewChange={setActiveView} />
            </SheetContent>
          </Sheet>
          {/* title removed on mobile to avoid overflow */}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>
      
      <main className="flex-1 p-4 md:p-8">
        {renderMainContent()}
      </main>

      <FloatingActionButton onClick={() => setShowScheduleTherapy(true)} />

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
        <AdvancedAddTreatmentForm 
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
