import { useState, useEffect } from "react";
import { db, TreatmentCategory } from "@/lib/database";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";


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
    
    const handleStorageChange = () => {
      loadCategories();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await db.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing category
        await db.updateCategory(editingId, formData);
        toast({
          title: "Kategorija ažurirana",
          description: "Kategorija je uspešno ažurirana"
        });
      } else {
        // Add new category
        await db.addCategory(formData);
        toast({
          title: "Kategorija dodana",
          description: "Nova kategorija je uspešno kreirana"
        });
      }
      
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom čuvanja kategorije",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: TreatmentCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu kategoriju?')) {
      try {
        await db.deleteCategory(id);
        toast({
          title: "Kategorija obrisana",
          description: "Kategorija je uspešno obrisana"
        });
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Greška",
          description: "Došlo je do greške prilikom brisanja kategorije",
          variant: "destructive"
        });
      }
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