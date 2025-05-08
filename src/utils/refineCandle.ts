import { toISOString } from './dateUtils';

export interface RefinedCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// date 형식 전환을 추구한 type
export interface ExtendedCandle extends RefinedCandle {
  date: Date;
  dateStr: string;
  isXAxisMark: boolean;
}

export const refineCandleData = (rawData: any[]): RefinedCandle[] => {
  return rawData.map((item) => ({
    timestamp: toISOString(item.candle_date_time_utc),
    open: item.opening_price,
    high: item.high_price,
    low: item.low_price,
    close: item.trade_price,
    volume: item.candle_acc_trade_volume,
  }));
};
