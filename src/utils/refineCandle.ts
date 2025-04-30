export interface RefinedCandle {
    timestamp: string; 
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  export const refineCandleData = (rawData: any[]): RefinedCandle[] => {
    return rawData.map((item) => ({
      timestamp: new Date(item.timestamp || item.candle_date_time_kst).toISOString(),
      open: item.opening_price,
      high: item.high_price,
      low: item.low_price,
      close: item.trade_price,
      volume: item.candle_acc_trade_volume,
    }));
  };
  