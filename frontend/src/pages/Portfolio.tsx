import {
  Briefcase,
  Plus,
  Wallet,
  TrendingUp,
  Landmark,
  PieChart,
  BarChart2,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { useState } from "react";
import AddHoldingModal from "../components/modals/AddHoldingModal";

export default function Portfolio() {
  const {
    getOpenTrades,
    tradingBalance,
    maskValue,
    getTotalEquity,
    getInvestedAmount,
    getPortfolioFloatingPL,
    getPortfolioFloatingPLPercent,
    getCashAllocation,
    getInvestedAllocation,
    getWinningPositions,
    getLosingPositions,
    getBestPerformer,
    getMarketValue,
    getFloatingPL,
    getFloatingPLPercent,
    closeTrade,
    refreshPrices,
    privacyMode,
    togglePrivacyMode,
  } = useDashboard();

  const [showAddHoldingModal, setShowAddHoldingModal] = useState(false);

  const openTrades = getOpenTrades();
  const totalEquity = getTotalEquity();
  const investedAmount = getInvestedAmount();
  const floatingPL = getPortfolioFloatingPL();

  return (
    <div className="fade-in space-y-8">
      {/* Portfolio Header with Privacy Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">My Portfolio</h3>
          <p className="text-sm text-gray-500 mt-1">
            Track your investments and trading balance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={togglePrivacyMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white transition-colors ${
              privacyMode
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {privacyMode ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            <span>{privacyMode ? "Privacy On" : "Privacy Off"}</span>
          </button>
          <button
            onClick={() => setShowAddHoldingModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-medium text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Trading Balance Card */}
        <div className="bg-linear-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-blue-400" />
            </div>
            <span className="text-xs text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
              Cash
            </span>
          </div>
          <p className="text-sm text-blue-300 mb-1">Trading Balance</p>
          <p className="text-3xl font-bold text-white">
            {maskValue(tradingBalance, "Rp ")}
          </p>
          <p className="text-xs text-blue-400 mt-2">Available for trading</p>
        </div>

        {/* Invested Amount Card */}
        <div className="bg-linear-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-purple-400" />
            </div>
            <span className="text-xs text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
              Invested
            </span>
          </div>
          <p className="text-sm text-purple-300 mb-1">Invested Amount</p>
          <p className="text-3xl font-bold text-white">
            {maskValue(investedAmount, "Rp ")}
          </p>
          <p className="text-xs text-purple-400 mt-2">
            {openTrades.length} active positions
          </p>
        </div>

        {/* Total Equity Card */}
        <div className="bg-linear-to-br from-emerald-600/20 to-teal-800/20 border border-emerald-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Landmark className="w-7 h-7 text-emerald-400" />
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                floatingPL >= 0
                  ? "text-emerald-400 bg-emerald-500/20"
                  : "text-red-400 bg-red-500/20"
              }`}
            >
              {getPortfolioFloatingPLPercent()}
            </span>
          </div>
          <p className="text-sm text-emerald-300 mb-1">Total Equity</p>
          <p className="text-3xl font-bold text-white">
            {maskValue(totalEquity, "Rp ")}
          </p>
          <p
            className={`text-xs mt-2 ${floatingPL >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            Floating P/L:{" "}
            {maskValue(Math.abs(floatingPL), floatingPL >= 0 ? "+Rp " : "-Rp ")}
          </p>
        </div>
      </div>

      {/* Portfolio Allocation Visual */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" />
            Portfolio Allocation
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Cash</span>
              <span className="text-sm font-semibold text-blue-400">
                {getCashAllocation()}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${getCashAllocation()}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-400">Invested</span>
              <span className="text-sm font-semibold text-purple-400">
                {getInvestedAllocation()}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${getInvestedAllocation()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            Quick Stats
          </h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {openTrades.length}
              </p>
              <p className="text-xs text-gray-500">Open Positions</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {getWinningPositions()}
              </p>
              <p className="text-xs text-gray-500">In Profit</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-400">
                {getLosingPositions()}
              </p>
              <p className="text-xs text-gray-500">In Loss</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {getBestPerformer()}
              </p>
              <p className="text-xs text-gray-500">Best Position</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-white">Active Holdings</h3>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
              {openTrades.length} positions
            </span>
          </div>
          <button
            onClick={refreshPrices}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh Prices</span>
          </button>
        </div>

        {openTrades.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">
              No active holdings. Add a new position to get started!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-dark">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Ticker
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Avg Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Qty (Lot)
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Market Value
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Floating P/L
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {openTrades.map((trade) => {
                  const pl = getFloatingPL(trade);
                  const plPercent = getFloatingPLPercent(trade);
                  const marketValue = getMarketValue(trade);

                  return (
                    <tr
                      key={trade.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              pl >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"
                            }`}
                          >
                            <span
                              className={`text-sm font-bold ${pl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                            >
                              {trade.ticker.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {trade.ticker}
                            </p>
                            <p className="text-xs text-gray-500">
                              {trade.company}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono text-white">
                          {maskValue(trade.entryPrice, "Rp ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-mono ${
                            trade.currentPrice >= trade.entryPrice
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {maskValue(trade.currentPrice, "Rp ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-gray-300">{trade.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono text-white">
                          {maskValue(marketValue, "Rp ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {pl >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                          <div className="text-right">
                            <p
                              className={`font-semibold ${pl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                            >
                              {maskValue(
                                Math.abs(pl),
                                pl >= 0 ? "+Rp " : "-Rp ",
                              )}
                            </p>
                            <p
                              className={`text-xs ${plPercent >= 0 ? "text-emerald-500" : "text-red-500"}`}
                            >
                              {plPercent >= 0 ? "+" : ""}
                              {plPercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => closeTrade(trade)}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors"
                        >
                          Close Position
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Holding Modal */}
      <AddHoldingModal
        isOpen={showAddHoldingModal}
        onClose={() => setShowAddHoldingModal(false)}
      />
    </div>
  );
}
