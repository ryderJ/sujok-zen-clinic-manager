import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

export const DateTimeHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
    const months = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
      'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day}. ${month} ${year}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sr-RS', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200">
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(currentTime)}</span>
        </div>
        <div className="w-px h-4 bg-slate-300"></div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};