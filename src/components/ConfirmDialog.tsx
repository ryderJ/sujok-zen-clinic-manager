
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const ConfirmDialog = ({ 
  onClose, 
  onConfirm, 
  title = "Potvrdi brisanje",
  message = "Da li ste sigurni da želite da obrišete ovu stavku? Ova akcija se ne može poništiti."
}: ConfirmDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-slate-600 mb-6">{message}</p>

        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
            Otkaži
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm} 
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            Obriši
          </Button>
        </div>
      </div>
    </div>
  );
};
