
import { useState } from "react";
import { Plus, Clock, CheckCircle, Calendar as CalendarIcon, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TherapyCalendarProps {
  onScheduleTherapy: () => void;
  onDeleteConfirm: (action: () => void) => void;
  fullView?: boolean;
}

// Mock therapy sessions
const mockSessionsData = [
  {
    id: 1,
    patientName: "Marija Rodriguez",
    date: "2024-06-24",
    time: "09:00",
    status: "scheduled",
    type: "Su Jok terapija",
    duration: 45
  },
  {
    id: 2,
    patientName: "Jovan Čen",
    date: "2024-06-24",
    time: "10:30",
    status: "completed",
    type: "Akupresura sesija",
    duration: 60
  },
  {
    id: 3,
    patientName: "Sara Williams",
    date: "2024-06-24",
    time: "14:00",
    status: "scheduled",
    type: "Inicijalna konsultacija",
    duration: 90
  },
  {
    id: 4,
    patientName: "Marija Rodriguez",
    date: "2024-06-25",
    time: "11:00",
    status: "scheduled",
    type: "Kontrolna sesija",
    duration: 45
  }
];

export const TherapyCalendar = ({ onScheduleTherapy, onDeleteConfirm, fullView = false }: TherapyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState("2024-06-24");
  const [sessions, setSessions] = useState(mockSessionsData);
  
  const todaysSessions = sessions.filter(session => session.date === selectedDate);
  const upcomingSessions = sessions.filter(session => new Date(session.date) > new Date(selectedDate));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "završeno";
      case "scheduled":
        return "zakazano";
      default:
        return status;
    }
  };

  const handleDeleteSession = (sessionId: number) => {
    const deleteAction = () => {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      console.log("Obrisao sesiju:", sessionId);
    };
    onDeleteConfirm(deleteAction);
  };

  const markAsCompleted = (sessionId: number) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: "completed" }
        : session
    ));
  };

  const renderSession = (session: any) => (
    <div key={session.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-semibold text-slate-800">
              {fullView ? `${new Date(session.date).toLocaleDateString('sr-RS')} u ${session.time}` : session.time}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(session.status)}`}>
              {getStatusIcon(session.status)}
              <span className="capitalize">{getStatusText(session.status)}</span>
            </span>
          </div>
          <p className="text-slate-700 font-medium">{session.patientName}</p>
          <p className="text-sm text-slate-500">{session.type} • {session.duration} min</p>
        </div>
        <div className="flex space-x-2">
          {session.status === "scheduled" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsCompleted(session.id)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Označi kao završeno"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteSession(session.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
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

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-slate-500" />
          <span className="font-medium text-slate-700">Danas - {new Date(selectedDate).toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-slate-700 mb-3">Danas</h3>
          <div className="space-y-3">
            {todaysSessions.length > 0 ? (
              todaysSessions.map(renderSession)
            ) : (
              <p className="text-slate-500 text-center py-8">Nema zakazanih sesija za danas</p>
            )}
          </div>
        </div>

        {fullView && upcomingSessions.length > 0 && (
          <div>
            <h3 className="font-medium text-slate-700 mb-3 mt-6">Nadolazeće sesije</h3>
            <div className="space-y-3">
              {upcomingSessions.slice(0, 5).map(renderSession)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
