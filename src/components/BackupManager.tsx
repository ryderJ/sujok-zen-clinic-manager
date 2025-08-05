import { useState } from "react";
import { Download, Upload, Database, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/database";

export const BackupManager = () => {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const exportData = async () => {
    try {
      const data = await db.createBackup();

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `neutro_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Backup kreiran",
        description: "Svi podaci su uspešno izvezeni",
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Neuspešno kreiranje backup-a",
        variant: "destructive",
      });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate backup structure
        if (!data.patients || !data.sessions || !data.treatments) {
          throw new Error('Invalid backup format');
        }

        // Import data
        await db.restoreBackup(data);

        // Trigger storage events to update UI
        window.dispatchEvent(new StorageEvent('storage'));
        
        toast({
          title: "Podaci uspešno uvezeni",
          description: `Backup iz ${new Date(data.exportDate).toLocaleDateString('sr-RS')} je učitan`,
        });

        // Reset file input
        event.target.value = '';
      } catch (error) {
        toast({
          title: "Greška pri uvozu",
          description: "Neispravna struktura backup fajla",
          variant: "destructive",
        });
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(file);
  };

  const clearAllData = async () => {
    if (window.confirm('Da li ste sigurni da želite da obrišete sve podatke? Ova akcija se ne može poništiti.')) {
      try {
        await db.restoreBackup({
          patients: [],
          sessions: [],
          treatments: [],
          categories: []
        });
        
        window.dispatchEvent(new StorageEvent('storage'));
        
        toast({
          title: "Podaci obrisani",
          description: "Svi podaci su uspešno obrisani",
        });
      } catch (error) {
        toast({
          title: "Greška",
          description: "Neuspešno brisanje podataka",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Upravljanje podacima</h1>
          <p className="text-slate-600">Kreiranje backup-a i uvoz podataka</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Redovno pravljenje backup-a je preporučeno radi sigurnosti vaših podataka. 
          Backup fajlovi se čuvaju lokalno na vašem računaru.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-500" />
              Izvezi podatke
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Kreiraj backup fajl koji sadrži sve pacijente, sesije, tretmane i kategorije.
            </p>
            <Button onClick={exportData} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Kreiraj backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Uvezi podatke
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Učitaj prethodno kreiran backup fajl da vratiš podatke.
            </p>
            <div>
              <Label htmlFor="backup-file">Odaberi backup fajl</Label>
              <Input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={importData}
                disabled={importing}
                className="mt-1"
              />
            </div>
            {importing && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Uvozim podatke...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Opasna zona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            Obriši sve podatke iz aplikacije. Ova akcija je nepovratna.
          </p>
          <Button 
            variant="destructive" 
            onClick={clearAllData}
            className="w-full md:w-auto"
          >
            Obriši sve podatke
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};