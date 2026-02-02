import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Header />
        <div className="p-8">
          <Outlet key={location.pathname} />
        </div>
      </main>
    </div>
  );
}
