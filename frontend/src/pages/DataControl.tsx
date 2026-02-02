import { Database, RefreshCw, Download, Upload, Trash2 } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export default function DataControl() {
  const { dataStats, mongoStatus, lastSync } = useDashboard();

  return (
    <div className="fade-in space-y-6">
      {/* Connection Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                mongoStatus === "connected"
                  ? "bg-emerald-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <Database
                className={`w-6 h-6 ${
                  mongoStatus === "connected"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">MongoDB Connection</h3>
              <p className="text-sm text-gray-500">Last sync: {lastSync}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                mongoStatus === "connected"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  mongoStatus === "connected"
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              {mongoStatus}
            </span>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Sync Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Total Records</p>
          <p className="text-2xl font-bold text-white">
            {dataStats.totalRecords.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Total Tickers</p>
          <p className="text-2xl font-bold text-white">
            {dataStats.totalTickers}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Days of Data</p>
          <p className="text-2xl font-bold text-white">
            {dataStats.daysOfData}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Trained Models</p>
          <p className="text-2xl font-bold text-white">
            {dataStats.modelsCount}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-6">Data Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
            <Download className="w-5 h-5 text-blue-400" />
            <span className="text-white">Export Data</span>
          </button>
          <button className="flex items-center justify-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
            <Upload className="w-5 h-5 text-emerald-400" />
            <span className="text-white">Import Data</span>
          </button>
          <button className="flex items-center justify-center gap-3 p-4 bg-gray-800 hover:bg-red-900/50 rounded-xl transition-colors group">
            <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
            <span className="text-white group-hover:text-red-400">
              Clear Cache
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
