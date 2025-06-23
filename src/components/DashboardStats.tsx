import { Users, Calendar, TrendingUp, Clock } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { useTherapySessions } from "@/hooks/useTherapySessions";

interface DashboardStatsProps {
  fullView?: boolean;
}

export const DashboardStats = ({ fullView = false }: DashboardStatsProps) => {
  const { data: patients = [] } = usePatients();
  const { data: sessions = [] } = useTherapySessions();

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

  const averageDuration = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length)
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
      title: "Ove nedelje",
      value: thisWeekSessions.length.toString(),
      change: "ukupno sesija",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Prosečna sesija",
      value: `${averageDuration} min`,
      change: "prosečno trajanje",
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
            {recentActivities.map((session, index) => (
              <div key={session.id} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">
                    Sesija završena sa {session.patient?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(session.date).toLocaleDateString('sr-RS')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};