import { Briefcase, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export default function Portfolio() {
  const {
    getOpenTrades,
    tradingBalance,
    maskValue,
    getTotalEquity,
    getInvestedAmount,
    getPortfolioFloatingPL,
  } = useDashboard();

  const openTrades = getOpenTrades();
  const totalEquity = getTotalEquity();
  const investedAmount = getInvestedAmount();
  const floatingPL = getPortfolioFloatingPL();

  return (
    <div className="fade-in space-y-6">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Total Equity</p>
          <p className="text-2xl font-bold text-white">
            {maskValue(totalEquity, "Rp ")}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Cash Balance</p>
          <p className="text-2xl font-bold text-white">
            {maskValue(tradingBalance, "Rp ")}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Invested</p>
          <p className="text-2xl font-bold text-white">
            {maskValue(investedAmount, "Rp ")}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Floating P&L</p>
          <p
            className={`text-2xl font-bold ${floatingPL >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {maskValue(Math.abs(floatingPL), floatingPL >= 0 ? "+Rp " : "-Rp ")}
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-white">My Holdings</h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Position</span>
          </button>
        </div>

        {openTrades.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No open positions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Avg Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Current Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Market Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {openTrades.map((trade) => {
                  const pl =
                    (trade.currentPrice - trade.entryPrice) * trade.quantity;
                  const plPercent =
                    ((trade.currentPrice - trade.entryPrice) /
                      trade.entryPrice) *
                    100;
                  const marketValue = trade.currentPrice * trade.quantity;

                  return (
                    <tr
                      key={trade.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {trade.ticker.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {trade.ticker}
                            </p>
                            <p className="text-xs text-gray-500">
                              {trade.company}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{trade.quantity}</td>
                      <td className="px-6 py-4 text-white">
                        Rp {trade.entryPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white">
                            Rp {trade.currentPrice.toLocaleString()}
                          </span>
                          {pl >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {maskValue(marketValue, "Rp ")}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p
                            className={`font-medium ${pl >= 0 ? "text-emerald-400" : "text-red-400"}`}
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
