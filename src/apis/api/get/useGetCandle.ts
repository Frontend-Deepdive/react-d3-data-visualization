import { useQuery } from '@tanstack/react-query';
import { baseApi } from '../../axios';
export const useGetCandle = () => {
  return useQuery({
    queryKey: ['candle'],
    queryFn: async () => {
      const res = await baseApi.get(`/candles/minutes/5?market=KRW-BTC&count=1`);
      return res;
    },
  });
};
