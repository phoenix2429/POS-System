import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Layers, Package, Compass, ShoppingCart, ClipboardList, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Categories", path: "/categories", icon: Layers },
  { label: "Items", path: "/items", icon: Package },
  { label: "Explore", path: "/explore", icon: Compass },
  { label: "Cart", path: "/cart", icon: ShoppingCart },
  { label: "Orders", path: "/orders", icon: ClipboardList },
];

const AppSidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          <span className="text-primary">POS</span> System
        </h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </RouterNavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-destructive/15 hover:text-destructive transition-all duration-200 w-full"
        >
          <LogOut className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
