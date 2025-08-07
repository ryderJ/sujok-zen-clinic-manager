
import { Users, Calendar, TrendingUp, Clock } from "lucide-react";
import { usePatients, useSessions } from "@/hooks/useDatabase";

interface DashboardStatsProps {
  fullView?: boolean;
}

export const DashboardStats = ({ fullView = false }: DashboardStatsProps) => {
  const { patients } = usePatients();
  const { sessions } = useSessions();

  const activePatients = patients.filter(p => p.is_active);
  const todaysSessions = sessions.filter(session => {
    const today = new Date().toISOString().split('T')[0];
    return session.date === today;
  });
  const completedTodaySessions = todaysSessions.filter(s => s.status === 'odrađena');
  
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo && sessionDate <= today;
  });

  const completedSessions = sessions.filter(s => s.status === 'odrađena');
  const totalDuration = completedSessions.reduce((sum, session) => {
    // Koristi duration_minutes iz sesije, ili defaultno 60 ako nije definisano
    const duration = session.duration_minutes || 60;
    console.log(`Session ${session.id}: duration = ${duration} minutes`); // Debug log
    return sum + duration;
  }, 0);
  const averageDuration = completedSessions.length > 0 
    ? Math.round(totalDuration / completedSessions.length)
    : 60;
  
  console.log(`Total sessions: ${completedSessions.length}, Total duration: ${totalDuration}, Average: ${averageDuration}`); // Debug log
  
  // Enhanced statistics
  const thisMonthSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return sessionDate >= firstDayOfMonth && sessionDate <= today;
  });
  
  const successRate = sessions.length > 0 
    ? Math.round((completedSessions.length / sessions.length) * 100)
    : 0;

  const stats = [
    {
      title: "Ukupno pacijenata",
      value: patients.length.toString(),
      change: `${activePatients.length} aktivnih`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Sesije danas",
      value: todaysSessions.length.toString(),
      change: `${completedTodaySessions.length} završeno`,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Ovaj mesec",
      value: thisMonthSessions.length.toString(),
      change: `${successRate}% uspešnost`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Prosečna sesija",
      value: `${averageDuration} min`,
      change: `${totalDuration} min ukupno`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const recentActivities = sessions
    .filter(session => session.status === 'odrađena')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Pregled prakse</h2>
      
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {fullView && recentActivities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Nedavne aktivnosti</h3>
          <div className="space-y-3">
            {recentActivities.map((session, index) => {
              const patient = patients.find(p => p.id === session.patient_id);
              return (
                <div key={session.id} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      Sesija završena sa {patient?.name || 'Nepoznat pacijent'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(session.date).toLocaleDateString('sr-RS')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
