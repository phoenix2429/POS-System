import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Topbar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
