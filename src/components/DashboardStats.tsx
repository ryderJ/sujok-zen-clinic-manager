
import { Users, Calendar, TrendingUp, Clock } from "lucide-react";

interface DashboardStatsProps {
  fullView?: boolean;
}

export const DashboardStats = ({ fullView = false }: DashboardStatsProps) => {
  const stats = [
    {
      title: "Total Patients",
      value: "23",
      change: "+3 this month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Sessions Today",
      value: "6",
      change: "3 completed",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "This Week",
      value: "28",
      change: "+15% vs last week",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Avg Session",
      value: "52 min",
      change: "Optimal duration",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Practice Overview</h2>
      
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

      {fullView && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Session completed with Maria Rodriguez</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">New patient Sarah Williams added</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Treatment plan updated for John Chen</p>
                <p className="text-xs text-slate-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
