import { useState, useEffect } from "react";
import { userService } from "@/services/endpoints";
import { toast } from "sonner";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ManageUsersPage = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const fetchUsers = () => {
    userService.getAll()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await userService.create(form);
      toast.success("User added successfully");
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add user");
    }
  };

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Form Section */}
      <div className="md:col-span-2">
        <div className="bg-card rounded-2xl border border-border p-8 h-full">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Name</label>
              <input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors" 
                placeholder="John Doe" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email</label>
              <input 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors" 
                placeholder="yourname@example.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Password</label>
              <input 
                type="password"
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors" 
                placeholder="*************" 
                required 
              />
            </div>
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg py-3 transition-colors mt-4">
              Save
            </button>
          </form>
        </div>
      </div>

      {/* Users List Section */}
      <div className="bg-card rounded-2xl border border-border p-5 h-[calc(100vh-10rem)] overflow-hidden flex flex-col">
        <input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-yellow-500 transition-colors" 
          placeholder="Search by keyword" 
        />
        
        <div className="flex-1 overflow-auto space-y-3 pr-2">
          {filteredUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No users found.</p>
          ) : (
            filteredUsers.map((u) => (
              <div key={u.id} className="bg-[#252525] p-4 rounded-xl border border-transparent hover:border-border transition-colors">
                <h3 className="font-semibold text-foreground text-base">{u.name}</h3>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default ManageUsersPage;
