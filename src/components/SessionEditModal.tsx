
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUpdateTherapySession } from "@/hooks/useTherapySessions";
import { TherapySession } from "@/lib/localDatabase";

interface SessionEditModalProps {
  session: TherapySession;
  isOpen: boolean;
  onClose: () => void;
}

export const SessionEditModal = ({ session, isOpen, onClose }: SessionEditModalProps) => {
  const [editData, setEditData] = useState({
    status: session.status,
    duration: session.duration,
    notes: session.notes || ""
  });

  const updateSession = useUpdateTherapySession();

  const handleSave = () => {
    updateSession.mutate({
      id: session.id,
      status: editData.status as 'zakazana' | 'odrađena' | 'propuštena',
      duration: editData.duration,
      notes: editData.notes || undefined
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Izmeni sesiju</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Status sesije</Label>
            <select
              id="status"
              value={editData.status}
              onChange={(e) => setEditData(prev => ({ 
                ...prev, 
                status: e.target.value as 'zakazana' | 'odrađena' | 'propuštena'
              }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            >
              <option value="zakazana">Zakazana</option>
              <option value="odrađena">Odrađena</option>
              <option value="propuštena">Propuštena</option>
            </select>
          </div>

          <div>
            <Label htmlFor="duration">Trajanje (minuti)</Label>
            <Input
              id="duration"
              type="number"
              value={editData.duration}
              onChange={(e) => setEditData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="notes">Napomene</Label>
            <textarea
              id="notes"
              value={editData.notes}
              onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Otkaži
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
              Sačuvaj
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
