import * as d3 from 'd3';
import { RefinedCandle } from '@/utils/refineCandle';
import CHART_SECOND_COLOR from '@/constants/chartSecondColor';
import { drawGrid, drawAxes, drawCandles, drawPriceLabels } from './renderParts';

interface Dimensions {
  width: number;
  height: number;
}

/**
 * 캔들스틱 차트를 d3 라이브러리로 그리는 함수
 *
 * @param data - 캔들 데이터 배열
 * @param svgElement - 차트를 그릴 SVG 엘리먼트
 * @param dimensions - 차트의 너비와 높이
 */
const drawCandleChart = (
  data: RefinedCandle[],
  svgElement: SVGSVGElement,
  dimensions: Dimensions = { width: 800, height: 600 },
) => {
  if (!data || data.length === 0) return;

  // SVG 초기화
  d3.select(svgElement).selectAll('*').remove();

  // 차트 관련 영역 크기 설정
  const margin = { top: 20, right: 60, bottom: 100, left: 60 };
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;
  const volumeHeight = 40;
  const priceChartHeight = height - volumeHeight - 20;

  d3.select(svgElement).selectAll('*').remove();

  const svg = d3
    .select(svgElement)
    .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
    .style('background', CHART_SECOND_COLOR.background)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const sortedData = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const x = d3
    .scaleTime()
    .domain([
      new Date(sortedData[0].timestamp),
      new Date(sortedData[sortedData.length - 1].timestamp),
    ])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(sortedData, (d) => d.low)! * 0.9998,
      d3.max(sortedData, (d) => d.high)! * 1.0002,
    ])
    .range([priceChartHeight, 0])
    .nice();

  const candleWidth = Math.max(Math.min(width / (sortedData.length + 2), 15), 2);
  const basePrice = sortedData[0].open;

  drawGrid(svg, x, y, width, priceChartHeight);
  drawAxes(svg, x, y, width, height, priceChartHeight);
  drawCandles(svg, x, y, sortedData, candleWidth);
  drawPriceLabels(svg, y, basePrice, width);
};

export default drawCandleChart;
