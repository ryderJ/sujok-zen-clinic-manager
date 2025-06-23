
import { Users, Calendar, Activity, Settings, BarChart3 } from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "patients", label: "Patients", icon: Users },
    { id: "therapies", label: "Therapies", icon: Calendar },
    { id: "statistics", label: "Statistics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Su Jok</h2>
            <p className="text-sm text-slate-500">Doktor</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeView === item.id
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
