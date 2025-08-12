
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
      <div className="bg-card rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-destructive/15 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
            Otkaži
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm} 
            variant="destructive"
            className="flex-1 rounded-xl"
          >
            Obriši
          </Button>
        </div>
      </div>
    </div>
  );
};
