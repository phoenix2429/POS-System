import { useState, useEffect } from "react";
import { categoryService } from "@/services/endpoints";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    categoryService.getAll().then(res => setCategories(res.data)).catch(console.error);
  }, []);
  const [name, setName] = useState("");
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await categoryService.create({ name });
      setCategories([...categories, res.data]);
      setName("");
      toast.success("Category added");
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.delete(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = async () => {
    if (!editItem || !editName.trim()) return;
    try {
      const res = await categoryService.update(editItem.id, { name: editName });
      setCategories(categories.map((c) => (c.id === editItem.id ? res.data : c)));
      setEditItem(null);
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Categories</h1>

      <div className="pos-card-static max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Add Category</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="pos-input flex-1" placeholder="Category name" />
          <button type="submit" className="pos-btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      <div className="pos-card-static">
        <h2 className="text-lg font-semibold mb-4">All Categories</h2>
        <table className="pos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="text-muted-foreground">{cat.id}</td>
                <td className="font-medium">{cat.name}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(cat); setEditName(cat.name); }} className="p-1.5 rounded-lg hover:bg-primary/15 text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-destructive/15 text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditItem(null)}>
          <div className="pos-card-static w-full max-w-md mx-4 p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Category</h3>
              <button onClick={() => setEditItem(null)} className="p-1 rounded-lg hover:bg-accent transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="pos-input w-full mb-4" />
            <button onClick={handleEdit} className="pos-btn-primary w-full">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
