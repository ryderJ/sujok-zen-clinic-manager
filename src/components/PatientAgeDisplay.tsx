import { CalendarDays } from "lucide-react";

interface PatientAgeDisplayProps {
  dateOfBirth: string;
  className?: string;
}

export const PatientAgeDisplay = ({ dateOfBirth, className = "" }: PatientAgeDisplayProps) => {
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = calculateAge(dateOfBirth);

  return (
    <div className={`flex items-center gap-2 text-sm text-slate-600 ${className}`}>
      <CalendarDays className="w-4 h-4" />
      <span>{age} godina</span>
    </div>
  );
};