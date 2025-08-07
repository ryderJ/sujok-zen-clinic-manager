import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('neutro_admin_logged_in');
    toast({
      title: "Odjavljeni ste",
      description: "Uspešno ste se odjavili iz sistema"
    });
    onLogout();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="fixed top-4 left-4 z-40 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Odjavi se
    </Button>
  );
};