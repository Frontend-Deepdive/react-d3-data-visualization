import { useEffect, useState } from 'react';
import { useGetCandle } from '../apis/api/get/useGetCandle';
import { refineCandleData, RefinedCandle } from '../utils/refineCandle';
import { useMarketMutation } from '../hooks/useMarketMutation';
import CandleChart from './Chart/CandleChart';

function CandleData() {
  const { market } = useMarketMutation();
  const [mergedData, setMergedData] = useState<RefinedCandle[]>([]);

  const candleData = useGetCandle({
    unit: 'minutes',
    minute: 1,
    marketCode: market,
    count: 30,
  });

  const refinedData = candleData?.data ? refineCandleData(candleData.data) : [];

  useEffect(() => {
    if (refinedData.length === 0) return;
    if (mergedData.length === 0) {
      const initialData = refinedData.slice(1);
      setMergedData(
        initialData.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ),
      );
    }
  }, [refinedData]);

  useEffect(() => {
    if (refinedData.length === 0) return;
    const latestData = refinedData[0];
    if (!latestData) return;

    setMergedData((prev) => {
      const isDuplicate = prev.some((item) => item.timestamp === latestData.timestamp);
      if (isDuplicate) return prev;

      const updated = [...prev, latestData];
      return updated.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
    });
  }, [refinedData.length > 0 ? refinedData[0].timestamp : null]);

  return (
    <>
      <CandleChart data={mergedData} />
    </>
  );
}

export default CandleData;
