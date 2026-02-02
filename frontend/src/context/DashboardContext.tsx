import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  Trade,
  Prediction,
  DashboardStats,
  DataStatistics,
  TrainingConfiguration,
  TrainingProgress,
  LogEntry,
} from "../types";

interface DashboardContextValue {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data
  trades: Trade[];
  setTrades: (trades: Trade[] | ((prev: Trade[]) => Trade[])) => void;
  predictions: Prediction[];

  // Balance
  tradingBalance: number;
  setTradingBalance: (balance: number | ((prev: number) => number)) => void;

  // Privacy
  privacyMode: boolean;
  togglePrivacyMode: () => void;

  // Stats
  stats: DashboardStats;
  dataStats: DataStatistics;

  // Status
  currentTime: string;
  mongoStatus: string;
  lastSync: string;

  // Training
  trainingConfig: TrainingConfiguration;
  setTrainingConfig: (config: TrainingConfiguration) => void;
  trainingStats: TrainingProgress;
  trainingLogs: LogEntry[];
  isTraining: boolean;
  startTraining: () => void;
  stopTraining: () => void;
  addLog: (message: string, type?: LogEntry["type"]) => void;

  // Computed
  getOpenTrades: () => Trade[];
  getClosedTrades: () => Trade[];
  getInvestedAmount: () => number;
  getTotalEquity: () => number;
  getPortfolioFloatingPL: () => number;
  maskValue: (value: number, prefix?: string) => string;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const INITIAL_TRADES: Trade[] = [
  {
    id: 1,
    ticker: "BBRI.JK",
    company: "Bank Rakyat Indonesia",
    type: "BUY",
    status: "Open",
    entryPrice: 5350,
    exitPrice: null,
    currentPrice: 5425,
    quantity: 200,
    profit: null,
    profitPercent: null,
    date: "2026-01-30",
    notes: "Long-term hold",
  },
  {
    id: 2,
    ticker: "GOTO.JK",
    company: "GoTo Gojek Tokopedia",
    type: "BUY",
    status: "Open",
    entryPrice: 72,
    exitPrice: null,
    currentPrice: 78,
    quantity: 500,
    profit: null,
    profitPercent: null,
    date: "2026-01-29",
    notes: "Speculative play",
  },
  {
    id: 3,
    ticker: "BBCA.JK",
    company: "Bank Central Asia",
    type: "BUY",
    status: "Closed",
    entryPrice: 9650,
    exitPrice: 9875,
    currentPrice: 9875,
    quantity: 100,
    profit: 22500,
    profitPercent: 2.33,
    date: "2026-01-28",
    notes: "Strong technical breakout",
  },
];

const INITIAL_PREDICTIONS: Prediction[] = [
  {
    ticker: "BBCA.JK",
    company: "Bank Central Asia",
    lastClose: 9875,
    change: 2.34,
    signal: "BUY",
    confidence: 87,
    predicted: 10250,
    strategy: {
      entryLow: 9800,
      entryHigh: 9900,
      targetPrice: 10500,
      targetPercent: 6.3,
      stopLoss: 9500,
      stopLossPercent: -3.8,
      trailingStop: 2.5,
      riskReward: 1.7,
    },
  },
  {
    ticker: "BBRI.JK",
    company: "Bank Rakyat Indonesia",
    lastClose: 5425,
    change: -1.23,
    signal: "HOLD",
    confidence: 65,
    predicted: 5400,
    strategy: {
      entryLow: 5350,
      entryHigh: 5450,
      targetPrice: 5700,
      targetPercent: 5.1,
      stopLoss: 5200,
      stopLossPercent: -4.1,
      trailingStop: 2.0,
      riskReward: 1.2,
    },
  },
  {
    ticker: "TLKM.JK",
    company: "Telkom Indonesia",
    lastClose: 3850,
    change: 0.52,
    signal: "BUY",
    confidence: 78,
    predicted: 4100,
    strategy: {
      entryLow: 3800,
      entryHigh: 3900,
      targetPrice: 4200,
      targetPercent: 9.1,
      stopLoss: 3650,
      stopLossPercent: -5.2,
      trailingStop: 3.0,
      riskReward: 1.8,
    },
  },
  {
    ticker: "ASII.JK",
    company: "Astra International",
    lastClose: 5125,
    change: -2.15,
    signal: "SELL",
    confidence: 72,
    predicted: 4850,
    strategy: {
      entryLow: 5000,
      entryHigh: 5150,
      targetPrice: 4700,
      targetPercent: -8.3,
      stopLoss: 5400,
      stopLossPercent: 5.4,
      trailingStop: 2.5,
      riskReward: 1.5,
    },
  },
];

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [trades, setTrades] = useLocalStorage<Trade[]>(
    "tukuapps_trades",
    INITIAL_TRADES,
  );
  const [tradingBalance, setTradingBalance] = useLocalStorage<number>(
    "tukuapps_trading_balance",
    3000000,
  );
  const [privacyMode, setPrivacyMode] = useLocalStorage<boolean>(
    "tukuapps_privacy_mode",
    false,
  );
  const [currentTime, setCurrentTime] = useState("");
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfiguration>({
    epochs: 25,
    batchSize: 32,
    learningRate: "0.001",
    ticker: "ALL",
  });
  const [trainingStats, setTrainingStats] = useState<TrainingProgress>({
    currentEpoch: 0,
    currentLoss: 0,
    bestLoss: 999,
    elapsedTime: 0,
  });
  const [trainingLogs, setTrainingLogs] = useState<LogEntry[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  const predictions = INITIAL_PREDICTIONS;

  const stats: DashboardStats = {
    buySignals: predictions.filter((p) => p.signal === "BUY").length,
    sellSignals: predictions.filter((p) => p.signal === "SELL").length,
    holdSignals: predictions.filter((p) => p.signal === "HOLD").length,
    modelAccuracy: 87.5,
  };

  const dataStats: DataStatistics = {
    totalRecords: 1250847,
    totalTickers: 15,
    daysOfData: 365,
    modelsCount: 15,
    avgAccuracy: 85,
  };

  // Update clock every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const togglePrivacyMode = useCallback(() => {
    setPrivacyMode((prev) => !prev);
  }, [setPrivacyMode]);

  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "default") => {
      const time = `[${new Date().toLocaleTimeString()}]`;
      setTrainingLogs((prev) => [...prev, { time, message, type }]);
    },
    [],
  );

  const startTraining = useCallback(() => {
    if (isTraining) return;
    setIsTraining(true);
    setTrainingStats({
      currentEpoch: 0,
      currentLoss: 0,
      bestLoss: 999,
      elapsedTime: 0,
    });
    setTrainingLogs([]);
    addLog("Initializing training...", "info");
    addLog(
      `Configuration: ${trainingConfig.epochs} epochs, batch size ${trainingConfig.batchSize}`,
      "info",
    );
    addLog("Loading data...", "info");

    // Simulate training progress
    let epoch = 0;
    const trainingInterval = setInterval(() => {
      epoch++;
      const loss = Math.max(
        0.1,
        1 - epoch / trainingConfig.epochs + Math.random() * 0.1,
      );

      setTrainingStats((prev) => ({
        currentEpoch: epoch,
        currentLoss: loss,
        bestLoss: Math.min(prev.bestLoss, loss),
        elapsedTime: prev.elapsedTime + 1,
      }));

      addLog(
        `Epoch ${epoch}/${trainingConfig.epochs} - Loss: ${loss.toFixed(4)}`,
        "success",
      );

      if (epoch >= trainingConfig.epochs) {
        clearInterval(trainingInterval);
        setIsTraining(false);
        addLog("Training completed!", "success");
      }
    }, 1000);
  }, [isTraining, trainingConfig, addLog]);

  const stopTraining = useCallback(() => {
    setIsTraining(false);
    addLog("Training stopped by user", "warning");
  }, [addLog]);

  const getOpenTrades = useCallback(() => {
    return trades.filter((t) => t.status === "Open");
  }, [trades]);

  const getClosedTrades = useCallback(() => {
    return trades.filter((t) => t.status === "Closed");
  }, [trades]);

  const getInvestedAmount = useCallback(() => {
    return getOpenTrades().reduce(
      (sum, t) => sum + t.entryPrice * t.quantity,
      0,
    );
  }, [getOpenTrades]);

  const getMarketValueTotal = useCallback(() => {
    return getOpenTrades().reduce(
      (sum, t) => sum + t.currentPrice * t.quantity,
      0,
    );
  }, [getOpenTrades]);

  const getTotalEquity = useCallback(() => {
    return tradingBalance + getMarketValueTotal();
  }, [tradingBalance, getMarketValueTotal]);

  const getPortfolioFloatingPL = useCallback(() => {
    return getOpenTrades().reduce(
      (sum, t) => sum + (t.currentPrice - t.entryPrice) * t.quantity,
      0,
    );
  }, [getOpenTrades]);

  const maskValue = useCallback(
    (value: number, prefix = "") => {
      return privacyMode
        ? `${prefix}******`
        : `${prefix}${value.toLocaleString()}`;
    },
    [privacyMode],
  );

  const contextValue: DashboardContextValue = {
    activeTab,
    setActiveTab,
    trades,
    setTrades,
    predictions,
    tradingBalance,
    setTradingBalance,
    privacyMode,
    togglePrivacyMode,
    stats,
    dataStats,
    currentTime,
    mongoStatus: "connected",
    lastSync: "2026-02-01 08:30:00",
    trainingConfig,
    setTrainingConfig,
    trainingStats,
    trainingLogs,
    isTraining,
    startTraining,
    stopTraining,
    addLog,
    getOpenTrades,
    getClosedTrades,
    getInvestedAmount,
    getTotalEquity,
    getPortfolioFloatingPL,
    maskValue,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
