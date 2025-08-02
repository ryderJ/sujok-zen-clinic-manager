import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TherapySession } from "@/lib/database";

interface EditSessionFormProps {
  session: TherapySession;
  onSave: (sessionData: Partial<TherapySession>) => void;
  onCancel: () => void;
}

export const EditSessionForm = ({ session, onSave, onCancel }: EditSessionFormProps) => {
  const [formData, setFormData] = useState({
    date: session.date.split('T')[0],
    status: session.status,
    notes: session.notes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: formData.date,
      status: formData.status as 'zakazana' | 'odrađena' | 'otkazana',
      notes: formData.notes
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Izmeni sesiju</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Datum sesije</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status sesije</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Izaberite status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zakazana">Zakazana</SelectItem>
                <SelectItem value="odrađena">Odrađena</SelectItem>
                <SelectItem value="otkazana">Otkazana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Napomene</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Unesite napomene o sesiji..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Otkaži
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Sačuvaj izmene
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};