import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export interface TreatmentCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

export const TreatmentCategoryManager = () => {
  const [categories, setCategories] = useState<TreatmentCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6"
  });
  const { toast } = useToast();

  const colors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
    "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const stored = localStorage.getItem('neutro_treatment_categories');
      if (stored) {
        setCategories(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const saveCategories = (updatedCategories: TreatmentCategory[]) => {
    localStorage.setItem('neutro_treatment_categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
    window.dispatchEvent(new StorageEvent('storage'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing category
      const updated = categories.map(cat => 
        cat.id === editingId 
          ? { ...cat, ...formData }
          : cat
      );
      saveCategories(updated);
      toast({
        title: "Kategorija ažurirana",
        description: "Kategorija je uspešno ažurirana"
      });
    } else {
      // Add new category
      const newCategory: TreatmentCategory = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        created_at: new Date().toISOString()
      };
      saveCategories([...categories, newCategory]);
      toast({
        title: "Kategorija dodana",
        description: "Nova kategorija je uspešno kreirana"
      });
    }
    
    resetForm();
  };

  const handleEdit = (category: TreatmentCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu kategoriju?')) {
      const updated = categories.filter(cat => cat.id !== id);
      saveCategories(updated);
      toast({
        title: "Kategorija obrisana",
        description: "Kategorija je uspešno obrisana"
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      color: "#3b82f6"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {editingId ? "Izmeni kategoriju" : "Dodaj novu kategoriju"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Naziv kategorije *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="npr. Su Jok terapija"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Opis kategorije</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Kratak opis kategorije tretmana"
              />
            </div>
            
            <div>
              <Label>Boja kategorije</Label>
              <div className="flex gap-2 mt-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-slate-800' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                {editingId ? "Ažuriraj" : "Dodaj"} kategoriju
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Otkaži
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Postojeće kategorije</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Nema definisanih kategorija</p>
          ) : (
            <div className="space-y-3">
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge style={{ backgroundColor: category.color, color: 'white' }}>
                      {category.name}
                    </Badge>
                    {category.description && (
                      <span className="text-sm text-slate-600">{category.description}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};