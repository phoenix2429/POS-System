import { User, LogOut, Monitor } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink as RouterNavLink } from "react-router-dom";

const navItems = [
  { label: "DASHBOARD", path: "/" },
  { label: "EXPLORE", path: "/explore" },
  { label: "MANAGE ITEMS", path: "/items" },
  { label: "MANAGE CATEGORIES", path: "/categories" },
  { label: "MANAGE USERS", path: "/users" }, // Will create this later
  { label: "ORDER HISTORY", path: "/orders" },
];

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-[#1c1c1c] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-8 h-full">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 text-foreground font-bold tracking-tight">
          <div className="p-1.5 bg-card border border-border rounded-lg shadow-sm">
             <Monitor className="w-5 h-5 text-green-500" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex h-full items-center gap-6">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center h-full border-b-2 px-1 text-sm font-semibold transition-colors pt-1 ${
                  isActive
                    ? "border-yellow-500 text-yellow-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {item.label}
            </RouterNavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 hidden sm:flex">
        <div className="flex items-center gap-2 bg-[#252525] rounded-full px-4 py-1.5 border border-border">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{user || "Admin"}</span>
        </div>
        <button onClick={logout} className="p-2 rounded-full hover:bg-accent transition-colors" title="Logout">
          <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
