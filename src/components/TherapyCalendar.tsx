import { useState } from "react";
import { Plus, Clock, CheckCircle, Calendar as CalendarIcon, Trash2, Check, Filter, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTherapySessions, useUpdateTherapySession, useDeleteTherapySession } from "@/hooks/useTherapySessions";

interface TherapyCalendarProps {
  onScheduleTherapy: () => void;
  onDeleteConfirm: (action: () => void) => void;
  fullView?: boolean;
}

export const TherapyCalendar = ({ onScheduleTherapy, onDeleteConfirm, fullView = false }: TherapyCalendarProps) => {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [patientFilter, setPatientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: sessions = [], isLoading } = useTherapySessions();
  const updateSession = useUpdateTherapySession();
  const deleteSession = useDeleteTherapySession();

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "odrađena":
        return <CheckCircle className="w-4 h-4" />;
      case "zakazana":
        return <Clock className="w-4 h-4" />;
      case "propuštena":
        return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const deleteAction = () => {
      deleteSession.mutate(sessionId);
    };
    onDeleteConfirm(deleteAction);
  };

  const markAsCompleted = (sessionId: string) => {
    updateSession.mutate({
      id: sessionId,
      status: 'odrađena'
    });
  };

  const openSessionModal = (session: any) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => {
      const matchesDate = !dateFilter || session.date.includes(dateFilter);
      const matchesPatient = !patientFilter || 
        session.patient?.name.toLowerCase().includes(patientFilter.toLowerCase());
      const matchesStatus = !statusFilter || session.status === statusFilter;
      return matchesDate && matchesPatient && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return dateA - dateB;
    });

  const todaysSessions = filteredSessions.filter(session => {
    const today = new Date().toISOString().split('T')[0];
    return session.date === today;
  });

  const upcomingSessions = filteredSessions.filter(session => {
    const today = new Date().toISOString().split('T')[0];
    return session.date > today;
  });

  const pastSessions = filteredSessions.filter(session => {
    const today = new Date().toISOString().split('T')[0];
    return session.date < today;
  });

  const renderSession = (session: any) => (
    <div key={session.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer"
         onClick={() => openSessionModal(session)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-semibold text-slate-800">
              {fullView ? `${new Date(session.date).toLocaleDateString('sr-RS')} u ${session.time}` : session.time}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(session.status)}`}>
              {getStatusIcon(session.status)}
              <span className="capitalize">{session.status}</span>
            </span>
          </div>
          <p className="text-slate-700 font-medium">{session.patient?.name}</p>
          <p className="text-sm text-slate-500">{session.type} • {session.duration} min</p>
          {session.notes && (
            <p className="text-xs text-slate-400 mt-1 truncate">{session.notes}</p>
          )}
        </div>
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          {session.status === "zakazana" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsCompleted(session.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Označi kao završeno"
              disabled={updateSession.isPending}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteSession(session.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={deleteSession.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-center py-8">
          <div className="text-slate-500">Učitavam sesije...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Terapijske sesije</h2>
          <Button 
            onClick={onScheduleTherapy}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Zakaži sesiju
          </Button>
        </div>

        {/* Filters */}
        {fullView && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700">Filteri</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Datum</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Pacijent</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pretraži pacijente..."
                    value={patientFilter}
                    onChange={(e) => setPatientFilter(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="">Svi statusi</option>
                  <option value="zakazana">Zakazana</option>
                  <option value="odrađena">Odrađena</option>
                  <option value="propuštena">Propuštena</option>
                </select>
              </div>
            </div>
            {(dateFilter || patientFilter || statusFilter) && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateFilter("");
                    setPatientFilter("");
                    setStatusFilter("");
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Obriši filtere
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {/* Today's Sessions */}
          {(!fullView || todaysSessions.length > 0) && (
            <div>
              <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>Danas - {new Date().toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </h3>
              <div className="space-y-3">
                {todaysSessions.length > 0 ? (
                  todaysSessions.map(renderSession)
                ) : (
                  <p className="text-slate-500 text-center py-8">Nema zakazanih sesija za danas</p>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Sessions */}
          {fullView && upcomingSessions.length > 0 && (
            <div>
              <h3 className="font-medium text-slate-700 mb-3">Nadolazeće sesije</h3>
              <div className="space-y-3">
                {upcomingSessions.map(renderSession)}
              </div>
            </div>
          )}

          {/* Past Sessions */}
          {fullView && pastSessions.length > 0 && (
            <div>
              <h3 className="font-medium text-slate-700 mb-3">Prethodne sesije</h3>
              <div className="space-y-3">
                {pastSessions.slice(0, 10).map(renderSession)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session Details Modal */}
      <Dialog open={showSessionModal} onOpenChange={setShowSessionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalji sesije</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-800">{selectedSession.patient?.name}</p>
                  <p className="text-sm text-slate-500">{selectedSession.type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-800">
                    {new Date(selectedSession.date).toLocaleDateString('sr-RS')} u {selectedSession.time}
                  </p>
                  <p className="text-sm text-slate-500">{selectedSession.duration} minuta</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  {getStatusIcon(selectedSession.status)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSession.status)}`}>
                  {selectedSession.status}
                </span>
              </div>

              {selectedSession.notes && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm text-slate-600 font-medium mb-1">Napomene:</p>
                  <p className="text-sm text-slate-700">{selectedSession.notes}</p>
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                {selectedSession.status === "zakazana" && (
                  <Button
                    onClick={() => {
                      markAsCompleted(selectedSession.id);
                      setShowSessionModal(false);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    disabled={updateSession.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Označi kao završeno
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDeleteSession(selectedSession.id);
                    setShowSessionModal(false);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={deleteSession.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Obriši
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};