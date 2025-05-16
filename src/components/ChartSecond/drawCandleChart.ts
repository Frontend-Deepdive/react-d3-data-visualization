import * as d3 from 'd3';
import { RefinedCandle } from '@/utils/refineCandle';
import CHART_SECOND_COLOR from '@/constants/chartSecondColor';
import { drawGrid, drawAxes, drawCandles, drawPriceLabels } from './renderCharts';

interface Dimensions {
  width: number;
  height: number;
}

/**
 * 전체 D3 기반 캔들차트를 그리는 메인 함수
 * - 스케일 정의
 * - 영역 초기화 및 배경 설정
 * - 서브 렌더 함수 호출
 */
const drawCandleChart = (
  data: RefinedCandle[],
  svgElement: SVGSVGElement,
  dimensions: Dimensions = { width: 800, height: 600 },
) => {
  if (!data || data.length === 0) return;

  // 마진 및 내부 영역 크기 계산
  const margin = { top: 20, right: 60, bottom: 100, left: 60 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

  // SVG 초기화 및 배경 설정
  d3.select(svgElement).selectAll('*').remove();

  const svg = d3
    .select(svgElement)
    .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
    .style('background', CHART_SECOND_COLOR.background)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // 시간 순 정렬
  const sortedData = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  // X축 시간 간격 정의
  const x = d3
    .scaleTime()
    .domain([
      new Date(sortedData[0].timestamp),
      new Date(sortedData[sortedData.length - 1].timestamp),
    ])
    .range([0, width]);

  // Y축 가격 스케일 정의
  const y = d3
    .scaleLinear()
    .domain([
      d3.min(sortedData, (d) => d.low)! * 0.9998,
      d3.max(sortedData, (d) => d.high)! * 1.0002,
    ])
    .range([height, 0])
    .nice();

  // 캔들 너비 및 기준 가격 계산
  const candleWidth = Math.max(Math.min(width / (sortedData.length + 2), 15), 2);
  const basePrice = sortedData[0].open;

  // 렌더링 관련 함수 호출
  drawGrid(svg, x, y, width, height);
  drawAxes(svg, x, y, width, height);
  drawCandles(svg, x, y, sortedData, candleWidth);
  drawPriceLabels(svg, y, basePrice, width);
};

export default drawCandleChart;
