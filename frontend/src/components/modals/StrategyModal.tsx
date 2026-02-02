import {
  X,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Bookmark,
  Zap,
} from "lucide-react";
import type { Prediction } from "../../types";

interface StrategyModalProps {
  stock: Prediction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StrategyModal({ stock, isOpen, onClose }: StrategyModalProps) {
  if (!isOpen || !stock) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {stock.ticker.substring(0, 2)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{stock.ticker}</h3>
              <p className="text-sm text-gray-500">{stock.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Signal Badge */}
          <div className="flex items-center gap-4">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getSignalStyle(stock.signal)}`}
            >
              {getSignalIcon(stock.signal)}
              {stock.signal} SIGNAL
            </span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-500">Confidence:</span>
              <span className="text-sm font-bold text-white">
                {stock.confidence}%
              </span>
            </div>
          </div>

          {/* Trading Strategy */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              AI Trading Strategy
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Entry Area */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">
                  Entry Zone
                </p>
                <p className="text-lg font-bold text-blue-400 font-mono">
                  Rp {stock.strategy.entryLow.toLocaleString()} - Rp{" "}
                  {stock.strategy.entryHigh.toLocaleString()}
                </p>
              </div>

              {/* Target */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">
                  Target Price
                </p>
                <p className="text-lg font-bold text-emerald-400 font-mono">
                  Rp {stock.strategy.targetPrice.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-400/70 mt-1">
                  +{stock.strategy.targetPercent}% potential
                </p>
              </div>

              {/* Stop Loss */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-xs text-red-400 uppercase tracking-wider mb-2">
                  Stop Loss
                </p>
                <p className="text-lg font-bold text-red-400 font-mono">
                  Rp {stock.strategy.stopLoss.toLocaleString()}
                </p>
                <p className="text-xs text-red-400/70 mt-1">
                  {stock.strategy.stopLossPercent}% from entry
                </p>
              </div>

              {/* Trailing Stop */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <p className="text-xs text-orange-400 uppercase tracking-wider mb-2">
                  Trailing Stop
                </p>
                <p className="text-lg font-bold text-orange-400 font-mono">
                  {stock.strategy.trailingStop}%
                </p>
                <p className="text-xs text-orange-400/70 mt-1">
                  Dynamic protection
                </p>
              </div>
            </div>
          </div>

          {/* Risk/Reward */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Risk/Reward Ratio</p>
                  <p className="text-xl font-bold text-emerald-400">
                    1 : {stock.strategy.riskReward}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Grade</p>
                <p className="text-xl font-bold text-yellow-400">
                  {stock.strategy.riskReward >= 2
                    ? "A"
                    : stock.strategy.riskReward >= 1.5
                      ? "B+"
                      : stock.strategy.riskReward >= 1
                        ? "B"
                        : "C"}
                </p>
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Last Close</p>
              <p className="text-lg font-bold text-white font-mono">
                Rp {stock.lastClose.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Change</p>
              <p
                className={`text-lg font-bold font-mono ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">AI Prediction</p>
              <p className="text-lg font-bold text-emerald-400 font-mono">
                Rp {stock.predicted.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium text-gray-300 transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl font-medium text-white flex items-center gap-2 transition-colors">
            <Bookmark className="w-4 h-4" />
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
