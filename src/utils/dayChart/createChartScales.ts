import * as d3 from 'd3';
import { ExtendedCandle } from '../refineCandle';

// 차트 스케일 생성 함수
export const createChartScales = (
  parsedData: ExtendedCandle[],
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
  volumeHeight: number,
) => {
  const x = d3
    .scaleBand()
    .domain(parsedData.map((d) => d.dateStr))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const minValue = d3.min(parsedData, (d) => d.low) ?? 0;
  const maxValue = d3.max(parsedData, (d) => d.high) ?? 1;

  const y = d3
    .scaleLinear()
    .domain([minValue * 0.999, maxValue * 1.001])
    .range([height - margin.bottom - volumeHeight, margin.top]);

  // 거래량 y축
  const volumeMax = d3.max(parsedData, (d) => d.volume) ?? 0;
  const yVolume = d3
    .scaleLinear()
    .domain([0, volumeMax * 1.1])
    .range([height - margin.bottom, height - margin.bottom - volumeHeight]);

  return { x, y, yVolume };
};
