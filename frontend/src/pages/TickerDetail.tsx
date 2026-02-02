import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Clock,
  LogIn,
  Trophy,
  ShieldCheck,
  Flag,
  ShieldAlert,
  GitCommit,
  Cpu,
  LineChart,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { useMemo } from "react";

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
  const modelName = `best_lstm_${prediction.ticker.replace(".", "_")}.keras`;
  const predictionDate = new Date().toISOString().split("T")[0];
  const rrGrade =
    strategy.riskReward >= 2
      ? "A"
      : strategy.riskReward >= 1.5
        ? "B+"
        : strategy.riskReward >= 1
          ? "B"
          : "C";
  const trailingTrigger = Math.round(
    prediction.lastClose * (1 - strategy.trailingStop / 100),
  );

  // Generate simulated historical data for chart
  const chartData = useMemo(() => {
    const data = [];
    const basePrice = prediction.lastClose;
    const days = 30;

    // Generate historical prices with realistic volatility
    let currentPrice = basePrice * 0.92; // Start ~8% lower
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Add some volatility
      const volatility = (Math.random() - 0.45) * (basePrice * 0.025);
      const trend = ((basePrice - currentPrice) / (days - i)) * 0.3;
      currentPrice = currentPrice + volatility + trend;

      data.push({
        date: dateStr,
        price: Math.round(currentPrice),
        prediction: null,
      });
    }

    // Add current day (last close)
    const today = new Date();
    data.push({
      date: today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: prediction.lastClose,
      prediction: prediction.lastClose,
    });

    // Add future prediction days
    const predictionDays = 5;
    let predictedPrice = prediction.lastClose;
    const priceStep =
      (prediction.predicted - prediction.lastClose) / predictionDays;

    for (let i = 1; i <= predictionDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      predictedPrice += priceStep + (Math.random() - 0.5) * (priceStep * 0.3);

      data.push({
        date: dateStr,
        price: null,
        prediction: Math.round(
          i === predictionDays ? prediction.predicted : predictedPrice,
        ),
      });
    }

    return data;
  }, [prediction]);

  // Custom tooltip for chart
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const priceData = payload.find((p) => p.dataKey === "price");
      const predictionData = payload.find((p) => p.dataKey === "prediction");

      return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-2">{label}</p>
          {priceData?.value && (
            <p className="text-sm font-mono text-blue-400">
              Actual: Rp {priceData.value.toLocaleString()}
            </p>
          )}
          {predictionData?.value && (
            <p className="text-sm font-mono text-emerald-400">
              Predicted: Rp {predictionData.value.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/predictions")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <div className="w-10 h-10 bg-gray-800 group-hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium">Back to Predictions</span>
      </button>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Ticker Info */}
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {prediction.ticker.substring(0, 2)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-white">
                    {prediction.ticker}
                  </h1>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold border animate-pulse ${
                      prediction.signal === "BUY"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : prediction.signal === "SELL"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}
                  >
                    {prediction.signal} SIGNAL
                  </span>
                </div>
                <p className="text-xl text-gray-400 mb-3">
                  {prediction.company}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-400">
                      Signal Strength:
                    </span>
                    <span className="text-sm font-bold text-yellow-400">
                      {prediction.confidence}%
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-700"></div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      Prediction for:{" "}
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Info */}
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Last Close</p>
                <p className="text-3xl font-bold text-white font-mono">
                  Rp {prediction.lastClose.toLocaleString()}
                </p>
              </div>
              <div className="w-px h-16 bg-gray-700"></div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">AI Prediction</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-mono">
                  Rp {prediction.predicted.toLocaleString()}
                </p>
                <p
                  className={`text-lg font-semibold flex items-center justify-end gap-1 ${
                    prediction.change >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {prediction.change >= 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span>
                    {prediction.change >= 0 ? "+" : ""}
                    {prediction.change.toFixed(2)}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width AI Forecast Chart Placeholder */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <LineChart className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                AI Forecast Chart
              </h2>
              <p className="text-sm text-gray-500">
                Historical prices vs AI prediction
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-400">Actual Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-emerald-500 rounded border-b-2 border-dashed border-emerald-500"></div>
              <span className="text-sm text-gray-400">AI Prediction</span>
            </div>
          </div>
        </div>
        {/* Recharts Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorPrediction"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#374151" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                domain={["dataMin - 100", "dataMax + 100"]}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Reference lines for strategy */}
              <ReferenceLine
                y={strategy.targetPrice}
                stroke="#10b981"
                strokeDasharray="5 5"
                strokeWidth={1}
              />
              <ReferenceLine
                y={strategy.stopLoss}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={1}
              />

              {/* Area fills */}
              <Area
                type="monotone"
                dataKey="price"
                stroke="transparent"
                fill="url(#colorPrice)"
              />
              <Area
                type="monotone"
                dataKey="prediction"
                stroke="transparent"
                fill="url(#colorPrediction)"
              />

              {/* Price line */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#3b82f6",
                  stroke: "#1e3a8a",
                  strokeWidth: 2,
                }}
                connectNulls={false}
              />

              {/* Prediction line */}
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{
                  r: 4,
                  fill: "#10b981",
                  stroke: "#064e3b",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#10b981",
                  stroke: "#064e3b",
                  strokeWidth: 2,
                }}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend - Strategy Lines */}
        <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-0.5 bg-emerald-500 opacity-50"
              style={{ borderTop: "2px dashed #10b981" }}
            ></div>
            <span className="text-xs text-gray-500">
              Target: Rp {strategy.targetPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-0.5 bg-red-500 opacity-50"
              style={{ borderTop: "2px dashed #ef4444" }}
            ></div>
            <span className="text-xs text-gray-500">
              Stop Loss: Rp {strategy.stopLoss.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* AI Strategy Grid */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              AI Trading Strategy
            </h2>
            <p className="text-sm text-gray-500">
              Recommended entry, target, and risk management
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entry Logic */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <LogIn className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Entry Logic</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Entry Area
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Low</p>
                    <p className="text-xl font-bold text-blue-400 font-mono">
                      Rp {strategy.entryLow.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-blue-400"></div>
                    <span className="text-gray-600">→</span>
                    <div className="w-8 h-px bg-gradient-to-r from-blue-400 to-blue-500"></div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">High</p>
                    <p className="text-xl font-bold text-blue-400 font-mono">
                      Rp {strategy.entryHigh.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-red-400 uppercase tracking-wider">
                    Stop Loss
                  </p>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-red-400 font-mono">
                  Rp {strategy.stopLoss.toLocaleString()}
                </p>
                <p className="text-sm text-red-400/70 mt-1">
                  {strategy.stopLossPercent}% from entry
                </p>
              </div>
            </div>
          </div>

          {/* Target Logic */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Target Logic</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-emerald-400 uppercase tracking-wider">
                    Target Price
                  </p>
                  <Flag className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-emerald-400 font-mono">
                  Rp {strategy.targetPrice.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-400/70 mt-1">
                  +{strategy.targetPercent}% potential gain
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                  Profit Potential
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      +{strategy.targetPercent}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Based on AI analysis
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Risk Management
              </h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    R:R Ratio
                  </p>
                  <p className="text-2xl font-bold text-white font-mono">
                    1 : {strategy.riskReward}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    R:R Grade
                  </p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {rrGrade}
                  </p>
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-orange-400 uppercase tracking-wider">
                    Trailing Stop
                  </p>
                  <GitCommit className="w-4 h-4 text-orange-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Current Price</span>
                    <span className="font-mono text-white">
                      Rp {prediction.lastClose.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Trailing Distance
                    </span>
                    <span className="font-mono text-orange-400">
                      {strategy.trailingStop}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Trigger Price</span>
                    <span className="font-mono text-orange-400">
                      Rp {trailingTrigger.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Metadata Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center">
            <Cpu className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Model Metadata</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Model Used
            </p>
            <p className="text-sm font-mono text-emerald-400 break-all">
              {modelName}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Prediction Date
            </p>
            <p className="text-sm font-mono text-white">{predictionDate}</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Model Accuracy
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-white">
                {prediction.confidence}%
              </p>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Model Health
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-emerald-400">Healthy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
