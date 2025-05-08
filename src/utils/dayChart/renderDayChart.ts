import * as d3 from 'd3';
import { RefinedCandle } from '../refineCandle';
import { parseDataWithDates } from './parseDataWithDates';
import { createChartScales } from './createChartScales';
import { drawAxes } from './drawAxes';
import { drawVolumeBars } from './drawVolumeBars';
import { drawLineAndPoints } from './drawLineAndPoints';
import { drawCurrentHorizontalLine } from './drawCurrentHorizontalLine';

// 차트 렌더링 메인 함수
export const renderChart = (
  refinedData: RefinedCandle[],
  svgRef: SVGSVGElement,
  gx: SVGSVGElement,
  gy: SVGSVGElement,
  width: number,
  height: number,
  volumeHeight: number,
  margin: { top: number; right: number; bottom: number; left: number },
) => {
  if (!refinedData || !refinedData.length || !svgRef) return;

  // 그래프를 그릴 대상 dom
  const svg = d3.select(svgRef);

  // 데이터 파싱
  const parsedData = parseDataWithDates(refinedData);
  // 스케일 생성
  const {
    x,
    y: yPrice,
    yVolume,
  } = createChartScales(parsedData, width, height, margin, volumeHeight);

  // 축 그리기 (yPrice, yVolume 모두 넘김)
  drawAxes(parsedData, x, yPrice, yVolume, gx, gy, width, height, margin);

  // 그래프
  drawLineAndPoints(svg, parsedData, x, yPrice);
  drawVolumeBars(svg, parsedData, x, yVolume);

  // 현재 데이터 기반 y축 수평선 그리기
  const latestPrice = parsedData[parsedData.length - 1]?.close;
  if (latestPrice !== undefined) {
    drawCurrentHorizontalLine(svg, yPrice, latestPrice, width, margin);
  }
};
