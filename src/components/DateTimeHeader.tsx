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
    <div className="hidden md:block fixed top-0 right-0 z-10 bg-background/80 backdrop-blur px-4 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>{formatDate(currentTime)}</span>
        <span>•</span>
        <span className="font-mono">{formatTime(currentTime)}</span>
      </div>
    </div>
  );
};