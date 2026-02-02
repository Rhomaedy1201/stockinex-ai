import { useLocation } from "react-router-dom";
import { Clock, Bell, Settings, Eye, EyeOff } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/portfolio": "My Portfolio",
  "/predictions": "AI Predictions",
  "/journal": "Trading Journal",
  "/training": "AI Training Center",
  "/data": "Data Control",
};

export function Header() {
  const location = useLocation();
  const { currentTime, privacyMode, togglePrivacyMode } = useDashboard();

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-500">
            Real-time stock prediction powered by AI
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Privacy Toggle */}
          <button
            onClick={togglePrivacyMode}
            className={`p-2 rounded-lg transition-colors ${
              privacyMode
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            title={privacyMode ? "Show values" : "Hide values"}
          >
            {privacyMode ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>

          {/* Clock */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">{currentTime}</span>
          </div>

          <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
