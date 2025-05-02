import * as d3 from 'd3';
import { toISOString } from '@/utils/dateUtils';
import * as constants from '../constants/dayChartConstants';
import { ExtendedCandle, RefinedCandle } from './refineCandle';

// 날짜 데이터 파싱 함수
const parseDataWithDates = (refinedData: RefinedCandle[]): ExtendedCandle[] => {
  // 날짜 기준 오름 차순 처리
  const sortedData = [...refinedData].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateA - dateB;
  });

  // dates 형식 날짜 기준으로 파싱
  let prevMonth = 0;
  return sortedData.map((d) => {
    const date = new Date(d.timestamp);
    const dateStr = toISOString(d.timestamp).split('T')[0];
    const [, month] = dateStr.split('-').map(Number);
    const isXAxisMark = prevMonth !== month;
    prevMonth = month;

    return {
      ...d,
      date,
      dateStr,
      isXAxisMark,
    };
  });
};

// 차트 스케일 생성 함수
const createChartScales = (
  parsedData: ExtendedCandle[],
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
) => {
  // x축 스케일
  const x = d3
    .scaleBand()
    .domain(parsedData.map((d) => d.dateStr))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  // y축 스케일을 위한 min, max 값
  const minValue = d3.min(parsedData, (d) => d.low);
  const maxValue = d3.max(parsedData, (d) => d.high);

  // y축 범위 타입 명시
  const yMin = minValue !== undefined ? minValue * 0.999 : 0;
  const yMax = maxValue !== undefined ? maxValue * 1.001 : 1;

  const y = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin.bottom, margin.top]);

  return { x, y };
};

// 축 생성 및 그리기 함수
const drawAxes = (
  parsedData: ExtendedCandle[],
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number>,
  gx: SVGGElement | null,
  gy: SVGGElement | null,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
) => {
  if (!gx || !gy) return;

  // x축 생성기
  const xAxis = d3
    .axisBottom(x)
    .tickValues(parsedData.filter((d) => d.isXAxisMark).map((d) => d.dateStr))
    .tickFormat((d) => {
      const [, month] = d.split('-');
      const monthIndex = parseInt(month) - 1;
      return `${constants.MONTH_NAME_ENG[monthIndex]}`;
    });

  // y축 생성기
  const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format('~s'));

  // 축 그리기
  d3.select(gx)
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  d3.select(gy).attr('transform', `translate(${margin.left}, 0)`).call(yAxis);
};

// 선과 점 그리기 함수
const drawLineAndPoints = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  parsedData: ExtendedCandle[],
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number>,
) => {
  // 이전 데이터 clear
  svg.selectAll('.line').remove();
  svg.selectAll('circle').remove();

  // 선 생성기
  const line = d3
    .line<ExtendedCandle>()
    .x((d) => (x(d.dateStr) || 0) + x.bandwidth() / 2)
    .y((d) => y(d.close));

  // 선 그리기
  svg
    .append('path')
    .datum(parsedData)
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line);

  // 점 그리기
  svg
    .selectAll('circle')
    .data(parsedData)
    .join('circle')
    .attr('cx', (d) => (x(d.dateStr) || 0) + x.bandwidth() / 2)
    .attr('cy', (d) => y(d.close))
    .attr('r', 1.5)
    .attr('fill', 'tomato');
};

// 차트 렌더링 메인 함수
export const renderChart = (
  refinedData: RefinedCandle[],
  svgRef: SVGSVGElement,
  gx: SVGSVGElement,
  gy: SVGSVGElement,
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
) => {
  if (!refinedData || !refinedData.length || !svgRef) return;

  // 그래프를 그릴 대상 dom
  const svg = d3.select(svgRef);

  // 데이터 파싱
  const parsedData = parseDataWithDates(refinedData);

  // 스케일 생성
  const { x, y } = createChartScales(parsedData, width, height, margin);

  // 축 그리기
  drawAxes(parsedData, x, y, gx, gy, height, margin);

  // 선과 점 그리기
  drawLineAndPoints(svg, parsedData, x, y);
};
