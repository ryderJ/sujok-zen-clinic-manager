
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalLoginForm } from "@/components/LocalLoginForm";
import { DateTimeHeader } from "@/components/DateTimeHeader";
import { LogoutButton } from "@/components/LogoutButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in locally
    const isLoggedIn = localStorage.getItem('neutro_admin_logged_in') === 'true';
    setIsAuthenticated(isLoggedIn);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Učitavanje...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LocalLoginForm onLogin={() => setIsAuthenticated(true)} />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DateTimeHeader />
      <LogoutButton onLogout={() => setIsAuthenticated(false)} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
