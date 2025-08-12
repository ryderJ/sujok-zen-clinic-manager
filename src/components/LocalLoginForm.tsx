import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocalLoginFormProps {
  onLogin: () => void;
}

export const LocalLoginForm = ({ onLogin }: LocalLoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Hardcoded credentials - change these in production
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "neutro2024";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple local authentication
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('neutro_admin_logged_in', 'true');
      const toastId = toast({
        title: "Uspešno prijavljivanje",
        description: "Dobrodošli u Neutro admin panel!",
      });
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        // Toast will be automatically dismissed by the system
      }, 3000);
      onLogin();
    } else {
      toast({
        title: "Greška pri prijavljivanju",
        description: "Neispravno korisničko ime ili lozinka",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Neutro Admin</CardTitle>
          <CardDescription>
            Goran Topalović
            <br />
            Prijavite se za pristup admin panelu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Korisničko ime"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Lozinka"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Prijavljivanje..." : "Prijavite se"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};