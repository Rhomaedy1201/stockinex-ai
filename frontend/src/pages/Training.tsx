import { Brain, Play, Square, Terminal } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export default function Training() {
  const {
    trainingConfig,
    setTrainingConfig,
    trainingStats,
    trainingLogs,
    isTraining,
    startTraining,
    stopTraining,
    dataStats,
  } = useDashboard();

  const getLogColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-emerald-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-white">Training Configuration</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Ticker</label>
              <select
                value={trainingConfig.ticker}
                onChange={(e) =>
                  setTrainingConfig({
                    ...trainingConfig,
                    ticker: e.target.value,
                  })
                }
                disabled={isTraining}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Tickers</option>
                <option value="BBCA.JK">BBCA.JK</option>
                <option value="BBRI.JK">BBRI.JK</option>
                <option value="TLKM.JK">TLKM.JK</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Epochs</label>
              <input
                type="number"
                value={trainingConfig.epochs}
                onChange={(e) =>
                  setTrainingConfig({
                    ...trainingConfig,
                    epochs: parseInt(e.target.value),
                  })
                }
                disabled={isTraining}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                value={trainingConfig.batchSize}
                onChange={(e) =>
                  setTrainingConfig({
                    ...trainingConfig,
                    batchSize: parseInt(e.target.value),
                  })
                }
                disabled={isTraining}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Learning Rate
              </label>
              <input
                type="text"
                value={trainingConfig.learningRate}
                onChange={(e) =>
                  setTrainingConfig({
                    ...trainingConfig,
                    learningRate: e.target.value,
                  })
                }
                disabled={isTraining}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={isTraining ? stopTraining : startTraining}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${
                isTraining
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {isTraining ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Training
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Training
                </>
              )}
            </button>
          </div>
        </div>

        {/* Training Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-6">Training Progress</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Epoch</span>
              <span className="text-white font-mono">
                {trainingStats.currentEpoch} / {trainingConfig.epochs}
              </span>
            </div>

            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{
                  width: `${(trainingStats.currentEpoch / trainingConfig.epochs) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Current Loss</p>
                <p className="text-xl font-mono text-white">
                  {trainingStats.currentLoss.toFixed(4)}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Best Loss</p>
                <p className="text-xl font-mono text-emerald-400">
                  {trainingStats.bestLoss === 999
                    ? "-"
                    : trainingStats.bestLoss.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Elapsed Time</p>
              <p className="text-xl font-mono text-white">
                {Math.floor(trainingStats.elapsedTime / 60)}m{" "}
                {trainingStats.elapsedTime % 60}s
              </p>
            </div>
          </div>
        </div>

        {/* Data Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-6">Data Statistics</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Total Records</span>
              <span className="text-white font-mono">
                {dataStats.totalRecords.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Total Tickers</span>
              <span className="text-white font-mono">
                {dataStats.totalTickers}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Days of Data</span>
              <span className="text-white font-mono">
                {dataStats.daysOfData}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Trained Models</span>
              <span className="text-white font-mono">
                {dataStats.modelsCount}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Avg Accuracy</span>
              <span className="text-emerald-400 font-mono">
                {dataStats.avgAccuracy}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Training Logs */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
          <Terminal className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-white">Training Logs</h3>
        </div>
        <div className="p-4 h-64 overflow-y-auto font-mono text-sm bg-gray-950 scrollbar-dark">
          {trainingLogs.length === 0 ? (
            <p className="text-gray-600">
              No logs yet. Start training to see output...
            </p>
          ) : (
            trainingLogs.map((log, index) => (
              <div key={index} className="py-1">
                <span className="text-gray-600">{log.time}</span>{" "}
                <span className={getLogColor(log.type)}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
