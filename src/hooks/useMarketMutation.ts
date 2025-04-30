import { useState } from 'react';

export const useMarketMutation = () => {
  const [market, setMarket] = useState('KRW-BTC'); // 기본: 비트코인

  const changeMarket = (newMarket: string) => {
    setMarket(newMarket);
  };

  return { market, changeMarket };
};
