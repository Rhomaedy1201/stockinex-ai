import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  BookOpen,
  Brain,
  Database,
  TrendingUp,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/portfolio", label: "My Portfolio", icon: Briefcase },
  { path: "/predictions", label: "Predictions", icon: BarChart3 },
  { path: "/journal", label: "Trading Journal", icon: BookOpen },
  { path: "/training", label: "AI Training", icon: Brain },
  { path: "/data", label: "Data Control", icon: Database },
];

export function Sidebar() {
  const { mongoStatus, lastSync } = useDashboard();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">TukuApps</h1>
            <p className="text-xs text-gray-500">Stock Prediction AI</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-transparent"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">MongoDB Status</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  mongoStatus === "connected"
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span
                className={`text-xs ${
                  mongoStatus === "connected"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {mongoStatus}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Last Sync</span>
            <span className="text-xs text-gray-400">{lastSync}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
