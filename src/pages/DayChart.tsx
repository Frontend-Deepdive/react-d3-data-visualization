import { useGetCandle } from '@/apis/api/get/useGetCandle';
import { refineCandleData, RefinedCandle } from '@/utils/refineCandle';
import { useEffect, useRef, useState } from 'react';
import { renderChart } from '@/utils/renderDayChart';
import * as constants from '../constants/dayChartConstants';

export default function DayChart({
  width = constants.DEFAULT_WIDTH,
  height = constants.DEFAULT_HEIGHT,
  margin = constants.DEFAULT_MARGIN,
  volume_height = constants.DEFAULT_VOLUME_HEIGHT,
}) {
  /**
   * data fetching
   */
  const { data, isSuccess } = useGetCandle({
    unit: constants.CANDLE_UNIT,
    marketCode: constants.MARKET_CODE,
    count: constants.DAY_CANDLE_CNT,
  });

  const [refinedData, setRefinedData] = useState<RefinedCandle[] | null>(null);

  // data fetching 성공 시 데이터 정제 처리
  useEffect(() => {
    if (isSuccess) setRefinedData(refineCandleData(data.data));
  }, [isSuccess]);

  const svgRef = useRef<SVGSVGElement>(null);
  const gx = useRef<SVGSVGElement>(null);
  const gy = useRef<SVGSVGElement>(null);

  /**
   * refinedData가 업데이트 될거나 style이 바뀔 때 마다 그래프 그리기
   */
  useEffect(() => {
    console.log('refinedData', refinedData);
    // 시세 chart 그리기
    if (refinedData && svgRef.current && gx.current && gy.current) {
      renderChart(
        refinedData,
        svgRef.current,
        gx.current,
        gy.current,
        width,
        height,
        volume_height,
        margin,
      );
    }
  }, [refinedData, width, height, margin]);

  return (
    <div className="w-full">
      <svg ref={svgRef} width={width} height={height}>
        <g ref={gx} />
        <g ref={gy} />
      </svg>
    </div>
  );
}
