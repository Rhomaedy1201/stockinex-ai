import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  BarChart3,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export default function TickerDetail() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const { predictions } = useDashboard();

  const prediction = predictions.find((p) => p.ticker === ticker);

  if (!prediction) {
    return (
      <div className="fade-in">
        <button
          onClick={() => navigate("/predictions")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Predictions</span>
        </button>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-400">Ticker not found: {ticker}</p>
        </div>
      </div>
    );
  }

  const { strategy } = prediction;

  return (
    <div className="fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/predictions")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Predictions</span>
      </button>

      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {prediction.ticker.substring(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {prediction.ticker}
              </h1>
              <p className="text-gray-500">{prediction.company}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              Rp {prediction.lastClose.toLocaleString()}
            </p>
            <p
              className={`text-sm ${prediction.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {prediction.change >= 0 ? "+" : ""}
              {prediction.change.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Signal & Confidence */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <span className="text-gray-400">AI Signal</span>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-semibold ${
              prediction.signal === "BUY"
                ? "bg-emerald-500/20 text-emerald-400"
                : prediction.signal === "SELL"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {prediction.signal === "BUY" ? (
              <TrendingUp className="w-5 h-5" />
            ) : prediction.signal === "SELL" ? (
              <TrendingDown className="w-5 h-5" />
            ) : null}
            {prediction.signal}
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 mb-2">Confidence</p>
          <p className="text-3xl font-bold text-white mb-2">
            {prediction.confidence}%
          </p>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 mb-2">Predicted Price</p>
          <p className="text-3xl font-bold text-white">
            Rp {prediction.predicted.toLocaleString()}
          </p>
          <p
            className={`text-sm ${prediction.predicted >= prediction.lastClose ? "text-emerald-400" : "text-red-400"}`}
          >
            {(
              ((prediction.predicted - prediction.lastClose) /
                prediction.lastClose) *
              100
            ).toFixed(2)}
            % from current
          </p>
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" />
          Trading Strategy
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Entry Zone</p>
              <p className="text-lg font-bold text-white">
                Rp {strategy.entryLow.toLocaleString()} - Rp{" "}
                {strategy.entryHigh.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-sm text-emerald-400 mb-2">Target Price</p>
              <p className="text-lg font-bold text-emerald-400">
                Rp {strategy.targetPrice.toLocaleString()} (
                {strategy.targetPercent > 0 ? "+" : ""}
                {strategy.targetPercent}%)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-400">Stop Loss</p>
              </div>
              <p className="text-lg font-bold text-red-400">
                Rp {strategy.stopLoss.toLocaleString()} (
                {strategy.stopLossPercent}%)
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Trailing Stop</p>
                  <p className="text-lg font-bold text-white">
                    {strategy.trailingStop}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Risk/Reward</p>
                  <p className="text-lg font-bold text-white">
                    1:{strategy.riskReward}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
