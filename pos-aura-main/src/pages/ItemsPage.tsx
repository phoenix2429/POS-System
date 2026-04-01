import { useState, useEffect, useRef } from "react";
import { Trash2, ImagePlus, Package } from "lucide-react";
import { itemService, categoryService } from "@/services/endpoints";
import { toast } from "sonner";

interface Item {
  id: number;
  name: string;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
  description: string;
  imagePath: string | null;
}

interface Category {
  id: number;
  name: string;
}

const ItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    itemService.getAll().then(res => setItems(res.data)).catch(console.error);
    categoryService.getAll().then(res => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setForm(f => ({ ...f, categoryId: res.data[0].id.toString() }));
      }
    }).catch(console.error);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("categoryId", form.categoryId);
    formData.append("description", form.description);
    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await itemService.create(formData);
      setItems([...items, res.data]);
      setForm({ name: "", price: "", categoryId: categories.length > 0 ? categories[0].id.toString() : "", description: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Item added");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add item");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await itemService.delete(id);
      setItems(items.filter((i) => i.id !== id));
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Items</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="pos-card-static lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Add Item</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pos-input w-full" placeholder="Item name" required />
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="pos-input w-full" placeholder="Price" type="number" step="0.01" required />
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="pos-input w-full" required>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="pos-input w-full" placeholder="Description" rows={3} />
            <div 
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : "Upload Image"}
              </p>
            </div>
            <button type="submit" className="pos-btn-primary w-full">Save Item</button>
          </form>
        </div>

        {/* Item Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="pos-card">
                {item.imagePath ? (
                  <div className="w-full h-32 bg-accent rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    <img src={`http://localhost:8080/uploads/${item.imagePath}`} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-accent rounded-xl mb-3 flex items-center justify-center">
                    <Package className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.categoryName}</p>
                  </div>
                  <span className="pos-badge bg-primary/15 text-primary font-semibold">₹{item.price.toFixed(2)}</span>
                </div>
                <button onClick={() => handleDelete(item.id)} className="mt-3 flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
