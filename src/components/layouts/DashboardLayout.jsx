import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "../../context/SidebarContext";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0 md:ml-64">
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
