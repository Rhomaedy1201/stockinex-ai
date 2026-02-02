import { X, PlusCircle, Plus, Info } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HoldingForm {
  ticker: string;
  company: string;
  avgPrice: string;
  currentPrice: string;
  quantity: string;
}

export default function AddHoldingModal({
  isOpen,
  onClose,
}: AddHoldingModalProps) {
  const { tradingBalance, setTradingBalance, setTrades } = useDashboard();

  const [form, setForm] = useState<HoldingForm>({
    ticker: "",
    company: "",
    avgPrice: "",
    currentPrice: "",
    quantity: "",
  });

  const resetForm = () => {
    setForm({
      ticker: "",
      company: "",
      avgPrice: "",
      currentPrice: "",
      quantity: "",
    });
  };

  const investmentAmount =
    parseFloat(form.avgPrice || "0") * parseInt(form.quantity || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entryPrice = parseFloat(form.avgPrice);
    const currentPrice = parseFloat(form.currentPrice);
    const qty = parseInt(form.quantity);
    const investmentTotal = entryPrice * qty;

    if (investmentTotal > tradingBalance) {
      alert("Insufficient trading balance for this position!");
      return;
    }

    const newTrade = {
      id: Date.now(),
      ticker: form.ticker.toUpperCase(),
      company: form.company,
      type: "BUY" as const,
      status: "Open" as const,
      entryPrice,
      exitPrice: null,
      currentPrice,
      quantity: qty,
      profit: null,
      profitPercent: null,
      date: new Date().toISOString().split("T")[0],
      notes: "Added via portfolio",
    };

    setTrades((prev) => [newTrade, ...prev]);
    setTradingBalance((prev) => prev - investmentTotal);

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Position</h3>
              <p className="text-xs text-gray-500">
                Add a stock to your portfolio
              </p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Ticker
              </label>
              <input
                type="text"
                value={form.ticker}
                onChange={(e) => setForm({ ...form, ticker: e.target.value })}
                required
                placeholder="e.g., BBCA.JK"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
                placeholder="e.g., Bank Central Asia"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Avg Buy Price
              </label>
              <input
                type="number"
                value={form.avgPrice}
                onChange={(e) => setForm({ ...form, avgPrice: e.target.value })}
                required
                step="0.01"
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Price
              </label>
              <input
                type="number"
                value={form.currentPrice}
                onChange={(e) =>
                  setForm({ ...form, currentPrice: e.target.value })
                }
                required
                step="0.01"
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Quantity (Lot)
            </label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
              min="1"
              placeholder="100"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
            />
          </div>

          {/* Investment Preview */}
          {form.avgPrice && form.quantity && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Investment:</span>
                <span className="text-lg font-bold text-purple-400">
                  Rp {investmentAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Info className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-purple-400">
                  This amount will be deducted from your Trading Balance
                </p>
              </div>
              {investmentAmount > tradingBalance && (
                <p className="text-xs text-red-400 mt-2">
                  ⚠️ Insufficient balance! Available: Rp{" "}
                  {tradingBalance.toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={investmentAmount > tradingBalance}
              className="px-6 py-3 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl font-medium text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Position</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
