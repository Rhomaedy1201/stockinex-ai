export type TradeType = "BUY" | "SELL";
export type TradeStatus = "Open" | "Closed";
export type SignalType = "BUY" | "SELL" | "HOLD";
export type LogType = "success" | "warning" | "error" | "info" | "default";

export interface Trade {
  id: number;
  ticker: string;
  company: string;
  type: TradeType;
  status: TradeStatus;
  entryPrice: number;
  exitPrice: number | null;
  currentPrice: number;
  quantity: number;
  profit: number | null;
  profitPercent: number | null;
  date: string;
  notes: string;
}

export interface Strategy {
  entryLow: number;
  entryHigh: number;
  targetPrice: number;
  targetPercent: number;
  stopLoss: number;
  stopLossPercent: number;
  trailingStop: number;
  riskReward: number;
}

export interface Prediction {
  ticker: string;
  company: string;
  lastClose: number;
  change: number;
  signal: SignalType;
  confidence: number;
  predicted: number;
  strategy: Strategy;
}

export interface DashboardStats {
  buySignals: number;
  sellSignals: number;
  holdSignals: number;
  modelAccuracy: number;
}

export interface DataStatistics {
  totalRecords: number;
  totalTickers: number;
  daysOfData: number;
  modelsCount: number;
  avgAccuracy: number;
}

export interface TrainingConfiguration {
  epochs: number;
  batchSize: number;
  learningRate: string;
  ticker: string;
}

export interface TrainingProgress {
  currentEpoch: number;
  currentLoss: number;
  bestLoss: number;
  elapsedTime: number;
}

export interface LogEntry {
  time: string;
  message: string;
  type: LogType;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
}

export interface TradeFormData {
  ticker: string;
  type: TradeType;
  status: TradeStatus;
  entryPrice: string;
  exitPrice: string;
  currentPrice: string;
  quantity: string;
  date: string;
  notes: string;
}

export interface PositionFormData {
  ticker: string;
  company: string;
  avgPrice: string;
  currentPrice: string;
  quantity: string;
}
