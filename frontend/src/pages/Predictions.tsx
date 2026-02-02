import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Eye,
  Target,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { StrategyModal } from "../components/modals/StrategyModal";
import type { Prediction } from "../types";

export default function Predictions() {
  const navigate = useNavigate();
  const { predictions, stats } = useDashboard();
  const [selectedStock, setSelectedStock] = useState<Prediction | null>(null);
  const [showStrategyModal, setShowStrategyModal] = useState(false);

  const openStrategyModal = (stock: Prediction) => {
    setSelectedStock(stock);
    setShowStrategyModal(true);
  };

  const closeStrategyModal = () => {
    setShowStrategyModal(false);
    setSelectedStock(null);
  };

  const openTickerDetail = (stock: Prediction) => {
    navigate(`/predictions/${stock.ticker}`);
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "BUY":
        return <TrendingUp className="w-4 h-4" />;
      case "SELL":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getSignalStyle = (signal: string) => {
    switch (signal) {
      case "BUY":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "SELL":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  return (
    <div className="fade-in space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          iconColor="text-emerald-500"
          value={stats.buySignals}
          label="Buy Signals"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          icon={TrendingDown}
          iconColor="text-red-500"
          value={stats.sellSignals}
          label="Sell Signals"
          bgColor="bg-red-500/10"
        />
        <StatCard
          icon={Minus}
          iconColor="text-yellow-500"
          value={stats.holdSignals}
          label="Hold Signals"
          bgColor="bg-yellow-500/10"
        />
        <StatCard
          icon={BarChart3}
          iconColor="text-blue-500"
          value={`${stats.modelAccuracy}%`}
          label="Model Accuracy"
          bgColor="bg-blue-500/10"
        />
      </div>

      {/* Predictions Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-white">AI Predictions</h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Ticker
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Last Close
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Change
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Signal
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Confidence
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                  Predicted
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {predictions.map((stock, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {stock.ticker.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{stock.ticker}</p>
                        <p className="text-xs text-gray-500">{stock.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    Rp {stock.lastClose.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        stock.change >= 0 ? "text-emerald-400" : "text-red-400"
                      }
                    >
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getSignalStyle(stock.signal)}`}
                    >
                      {getSignalIcon(stock.signal)}
                      {stock.signal}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${stock.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">
                        {stock.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    Rp {stock.predicted.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openStrategyModal(stock)}
                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                        title="View Strategy"
                      >
                        <Target className="w-4 h-4 text-purple-400" />
                      </button>
                      <button
                        onClick={() => openTickerDetail(stock)}
                        className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategy Modal */}
      <StrategyModal
        stock={selectedStock}
        isOpen={showStrategyModal}
        onClose={closeStrategyModal}
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  value: string | number;
  label: string;
  bgColor: string;
}

function StatCard({
  icon: Icon,
  iconColor,
  value,
  label,
  bgColor,
}: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div
        className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
