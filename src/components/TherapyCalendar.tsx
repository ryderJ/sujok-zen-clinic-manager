
import { useState } from "react";
import { Plus, Clock, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TherapyCalendarProps {
  onScheduleTherapy: () => void;
  fullView?: boolean;
}

// Mock therapy sessions
const mockSessions = [
  {
    id: 1,
    patientName: "Maria Rodriguez",
    date: "2024-06-24",
    time: "09:00",
    status: "scheduled",
    type: "Su Jok Therapy",
    duration: 45
  },
  {
    id: 2,
    patientName: "John Chen",
    date: "2024-06-24",
    time: "10:30",
    status: "completed",
    type: "Acupressure Session",
    duration: 60
  },
  {
    id: 3,
    patientName: "Sarah Williams",
    date: "2024-06-24",
    time: "14:00",
    status: "scheduled",
    type: "Initial Consultation",
    duration: 90
  },
  {
    id: 4,
    patientName: "Maria Rodriguez",
    date: "2024-06-25",
    time: "11:00",
    status: "scheduled",
    type: "Follow-up Session",
    duration: 45
  }
];

export const TherapyCalendar = ({ onScheduleTherapy, fullView = false }: TherapyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState("2024-06-24");
  
  const todaysSessions = mockSessions.filter(session => session.date === selectedDate);
  const upcomingSessions = mockSessions.filter(session => new Date(session.date) > new Date(selectedDate));

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

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Therapy Sessions</h2>
        <Button 
          onClick={onScheduleTherapy}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-slate-500" />
          <span className="font-medium text-slate-700">Today - {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-slate-700 mb-3">Today's Sessions</h3>
          <div className="space-y-3">
            {todaysSessions.length > 0 ? (
              todaysSessions.map((session) => (
                <div key={session.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-slate-800">{session.time}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          <span className="capitalize">{session.status}</span>
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium">{session.patientName}</p>
                      <p className="text-sm text-slate-500">{session.type} • {session.duration} min</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">No sessions scheduled for today</p>
            )}
          </div>
        </div>

        {fullView && upcomingSessions.length > 0 && (
          <div>
            <h3 className="font-medium text-slate-700 mb-3 mt-6">Upcoming Sessions</h3>
            <div className="space-y-3">
              {upcomingSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-slate-800">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          <span className="capitalize">{session.status}</span>
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium">{session.patientName}</p>
                      <p className="text-sm text-slate-500">{session.type} • {session.duration} min</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
