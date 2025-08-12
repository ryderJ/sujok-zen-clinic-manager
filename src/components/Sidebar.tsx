
import { Users, Calendar, Activity, BarChart3, Database, Tag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Kontrolna tabla", icon: Activity },
    { id: "patients", label: "Pacijenti", icon: Users },
    { id: "therapies", label: "Terapije", icon: Calendar },
    { id: "categories", label: "Kategorije", icon: Tag },
    { id: "backup", label: "Backup podataka", icon: Database },
    { id: "statistics", label: "Statistike", icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('neutro_admin_logged_in');
    window.location.reload();
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen relative">
      <div className="p-6 h-full">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Neutro</h2>
            <p className="text-sm text-slate-500">Goran Topalović</p>
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
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 justify-start"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Odjavi se</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
