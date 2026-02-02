import { BookOpen, Plus, Filter } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export default function Journal() {
  const { trades, getClosedTrades } = useDashboard();
  const closedTrades = getClosedTrades();

  return (
    <div className="fade-in space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-white">Trading Journal</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Trade</span>
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {trades.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No trades recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Ticker
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Entry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Exit/Current
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    P&L
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {trades.map((trade) => {
                  const exitOrCurrent = trade.exitPrice || trade.currentPrice;
                  const pl =
                    trade.status === "Closed"
                      ? trade.profit
                      : (trade.currentPrice - trade.entryPrice) *
                        trade.quantity;
                  const plPercent =
                    trade.status === "Closed"
                      ? trade.profitPercent
                      : ((trade.currentPrice - trade.entryPrice) /
                          trade.entryPrice) *
                        100;

                  return (
                    <tr
                      key={trade.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-400">{trade.date}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {trade.ticker}
                          </p>
                          <p className="text-xs text-gray-500">
                            {trade.company}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.type === "BUY"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {trade.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.status === "Open"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {trade.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">
                        Rp {trade.entryPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-white">
                        Rp {exitOrCurrent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {pl !== null && (
                          <div>
                            <p
                              className={`font-medium ${(pl || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}
                            >
                              {(pl || 0) >= 0 ? "+" : ""}Rp{" "}
                              {Math.abs(pl || 0).toLocaleString()}
                            </p>
                            <p
                              className={`text-xs ${(plPercent || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}
                            >
                              {(plPercent || 0) >= 0 ? "+" : ""}
                              {(plPercent || 0).toFixed(2)}%
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm max-w-[200px] truncate">
                        {trade.notes}
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
