import { useEffect, useRef, useState, useMemo } from 'react';
import { useGetCandle } from '@/apis/api/get/useGetCandle';

import drawCandleChart from './drawCandleChart';
import { refineCandleData } from '@/utils/refineCandle';
import { useMarketMutation } from '@/hooks/useMarketMutation';

/**
 * 초봉 캔들 차트 컴포넌트
 */
const ChartSecond = () => {
  const { market } = useMarketMutation();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const {
    data: rawCandles = [],
    isLoading,
    error,
    refetch,
  } = useGetCandle({ unit: 'seconds', marketCode: market, count: 30 });

  const candles = useMemo(() => refineCandleData(rawCandles), [rawCandles]);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({ width: 600, height: 400 });
    }
  }, []);

  useEffect(() => {
    if (candles.length > 0 && svgRef.current) {
      drawCandleChart(candles, svgRef.current, dimensions);
    }
  }, [candles, dimensions]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">{market} 초봉 캔들 차트</h2>
      <div ref={containerRef} className="w-full h-128">
        {isLoading ? (
          <div>로딩 중입니다...</div>
        ) : error ? (
          <div>데이터 로딩 오류 발생</div>
        ) : candles.length === 0 ? (
          <div>데이터가 없습니다.</div>
        ) : (
          <svg ref={svgRef} width="100%" height="100%" />
        )}
      </div>
    </div>
  );
};

export default ChartSecond;
