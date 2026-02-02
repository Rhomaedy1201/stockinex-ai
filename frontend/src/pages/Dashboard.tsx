import {
  TrendingUp,
  Wallet,
  Percent,
  Activity,
  Zap,
  BookOpen,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    stats,
    trades,
    predictions,
    getClosedTrades,
    getOpenTrades,
    tradingBalance,
    maskValue,
    getTotalEquity,
    getPortfolioFloatingPL,
  } = useDashboard();

  const closedTrades = getClosedTrades();
  const openTrades = getOpenTrades();
  const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const floatingPL = getPortfolioFloatingPL();
  const totalEquity = getTotalEquity();

  return (
    <div className="fade-in space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          iconBg="bg-emerald-500/20"
          iconColor="text-emerald-500"
          badge={`+${stats.buySignals}`}
          badgeColor="text-emerald-400 bg-emerald-500/20"
          value={stats.buySignals}
          label="Active Buy Signals"
        />
        <StatCard
          icon={Wallet}
          iconBg="bg-blue-500/20"
          iconColor="text-blue-500"
          badge="Portfolio"
          badgeColor="text-blue-400 bg-blue-500/20"
          value={maskValue(totalEquity, "Rp ")}
          label="Total Equity"
        />
        <StatCard
          icon={Percent}
          iconBg="bg-purple-500/20"
          iconColor="text-purple-500"
          badge={floatingPL >= 0 ? "Profit" : "Loss"}
          badgeColor={
            floatingPL >= 0
              ? "text-emerald-400 bg-emerald-500/20"
              : "text-red-400 bg-red-500/20"
          }
          value={maskValue(
            Math.abs(floatingPL),
            floatingPL >= 0 ? "+Rp " : "-Rp ",
          )}
          valueColor={floatingPL >= 0 ? "text-emerald-400" : "text-red-400"}
          label="Floating P&L"
        />
        <StatCard
          icon={Activity}
          iconBg="bg-orange-500/20"
          iconColor="text-orange-500"
          badge={`${openTrades.length} Open`}
          badgeColor="text-orange-400 bg-orange-500/20"
          value={trades.length}
          label="Total Trades"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Predictions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-white">Recent Predictions</h3>
            </div>
            <button
              onClick={() => navigate("/predictions")}
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {predictions.slice(0, 4).map((stock, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => navigate(`/predictions/${stock.ticker}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {stock.ticker.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">
                      {stock.ticker}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rp {stock.lastClose.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      stock.signal === "BUY"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : stock.signal === "SELL"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}
                  >
                    {stock.signal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-white">Portfolio Summary</h3>
            </div>
            <button
              onClick={() => navigate("/portfolio")}
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Cash Balance</p>
                <p className="text-xl font-bold text-white">
                  {maskValue(tradingBalance, "Rp ")}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Open Positions</p>
                <p className="text-xl font-bold text-white">
                  {openTrades.length}
                </p>
              </div>
            </div>

            {/* Open Positions List */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-3">
                Open Positions
              </p>
              {openTrades.slice(0, 3).map((trade) => {
                const pl =
                  (trade.currentPrice - trade.entryPrice) * trade.quantity;
                const plPercent =
                  ((trade.currentPrice - trade.entryPrice) / trade.entryPrice) *
                  100;
                return (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white text-sm">
                        {trade.ticker}
                      </p>
                      <p className="text-xs text-gray-500">
                        {trade.quantity} shares
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${pl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {pl >= 0 ? "+" : ""}
                        {maskValue(pl, "Rp ")}
                      </p>
                      <p
                        className={`text-xs ${pl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {plPercent >= 0 ? "+" : ""}
                        {plPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Trading Journal Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-white">Trading Performance</h3>
          </div>
          <button
            onClick={() => navigate("/journal")}
            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View Journal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-xs text-emerald-400 mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-emerald-400">
                {closedTrades.length > 0
                  ? (
                      (closedTrades.filter((t) => (t.profit || 0) > 0).length /
                        closedTrades.length) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-400 mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-blue-400">
                {closedTrades.length}
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <p className="text-xs text-purple-400 mb-1">Avg Return</p>
              <p className="text-2xl font-bold text-purple-400">
                {closedTrades.length > 0
                  ? (
                      closedTrades.reduce(
                        (sum, t) => sum + (t.profitPercent || 0),
                        0,
                      ) / closedTrades.length
                    ).toFixed(2)
                  : 0}
                %
              </p>
            </div>
            <div
              className={`${totalProfit >= 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"} border rounded-xl p-4 text-center`}
            >
              <p
                className={`text-xs ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"} mb-1`}
              >
                Total P&L
              </p>
              <p
                className={`text-2xl font-bold ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {maskValue(
                  Math.abs(totalProfit),
                  totalProfit >= 0 ? "+Rp " : "-Rp ",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeColor: string;
  value: string | number;
  valueColor?: string;
  label: string;
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  badge,
  badgeColor,
  value,
  valueColor = "text-white",
  label,
}: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <span className={`text-xs ${badgeColor} px-2 py-1 rounded-full`}>
          {badge}
        </span>
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
