import * as d3 from 'd3';
import { RefinedCandle } from '@/utils/refineCandle';
import CHART_SECOND_COLOR from '@/constants/chartSecondColor';
import { transformTimeformat } from '@/utils/dateUtils';

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
const drawUpbitCandleChart = (
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
  const volumeHeight = 40; // 거래량 차트 높이
  const priceChartHeight = height - volumeHeight - 20; // 가격 차트 높이

  // 색상 테마
  const colors = {
    background: CHART_SECOND_COLOR.background,
    gridLines: CHART_SECOND_COLOR.gridLines,
    axisText: CHART_SECOND_COLOR.axisText,
    upCandle: CHART_SECOND_COLOR.upCandle,
    downCandle: CHART_SECOND_COLOR.downCandle,
    neutralCandle: CHART_SECOND_COLOR.neutralCandle,
    upVolume: CHART_SECOND_COLOR.upVolume,
    downVolume: CHART_SECOND_COLOR.downVolume,
    basePrice: CHART_SECOND_COLOR.basePrice,
  };

  // SVG 설정
  const svg = d3
    .select(svgElement)
    .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
    .style('background', colors.background)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // 시계열 정렬
  const sortedData = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  // 1. X축 스케일 (시간)
  const x = d3
    .scaleTime()
    .domain([
      d3.min(sortedData, (d) => new Date(d.timestamp))!,
      d3.max(sortedData, (d) => new Date(d.timestamp))!,
    ])
    .range([0, width]);

  // 2. 가격 Y축 스케일
  const priceExtent = [
    d3.min(sortedData, (d) => d.low)! * 0.9998,
    d3.max(sortedData, (d) => d.high)! * 1.0002,
  ];

  const y = d3.scaleLinear().domain(priceExtent).range([priceChartHeight, 0]).nice();

  // 3. 거래량 Y축 스케일
  const volumeY = d3
    .scaleLinear()
    .domain([0, d3.max(sortedData, (d) => d.volume || 0)! * 1.1])
    .range([volumeHeight, 0]);

  // 가격 차트 영역
  const priceChart = svg.append('g').attr('class', 'price-chart');

  // 거래량 차트 영역
  const volumeChart = svg
    .append('g')
    .attr('class', 'volume-chart')
    .attr('transform', `translate(0, ${priceChartHeight + 20})`);

  // 그리드 라인 추가 (가격)
  priceChart
    .append('g')
    .attr('class', 'grid')
    .selectAll('line')
    .data(y.ticks(6))
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', (d) => y(d))
    .attr('y2', (d) => y(d))
    .attr('stroke', colors.gridLines)
    .attr('stroke-width', 0.5);

  // 그리드 라인 추가 (시간축)
  priceChart
    .append('g')
    .attr('class', 'grid')
    .selectAll('line')
    .data(x.ticks(12))
    .enter()
    .append('line')
    .attr('x1', (d) => x(d))
    .attr('x2', (d) => x(d))
    .attr('y1', 0)
    .attr('y2', priceChartHeight)
    .attr('stroke', colors.gridLines)
    .attr('stroke-width', 0.5);

  // 기준가격 (첫 번째 캔들의 시가)
  const basePrice = sortedData[0].open;

  // 기준선 추가
  priceChart
    .append('line')
    .attr('class', 'base-price-line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(basePrice))
    .attr('y2', y(basePrice))
    .attr('stroke', colors.basePrice)
    .attr('stroke-dasharray', '3,3')
    .attr('stroke-width', 1);

  // 기준가격 레이블
  priceChart
    .append('text')
    .attr('class', 'base-price-label')
    .attr('x', width + 5)
    .attr('y', y(basePrice) + 4)
    .attr('fill', colors.basePrice)
    .attr('font-size', 11)
    .text(basePrice.toLocaleString('ko-KR'));

  // X축 (시간)
  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(8)
        .tickFormat((d) => transformTimeformat(d as Date)),
    )
    .selectAll('text')
    .style('fill', colors.axisText)
    .style('font-size', '11px');

  // 가격 Y축 (왼쪽)
  priceChart
    .append('g')
    .attr('class', 'y-axis')
    .call(
      d3
        .axisLeft(y)
        .ticks(6)
        .tickFormat((d) => d.toLocaleString('ko-KR')),
    )
    .selectAll('text')
    .style('fill', colors.axisText)
    .style('font-size', '11px');

  // 가격 Y축 (오른쪽)
  priceChart
    .append('g')
    .attr('class', 'y-axis-right')
    .attr('transform', `translate(${width}, 0)`)
    .call(
      d3
        .axisRight(y)
        .ticks(6)
        .tickFormat((d) => d.toLocaleString('ko-KR')),
    )
    .selectAll('text')
    .style('fill', colors.axisText)
    .style('font-size', '11px');

  // 거래량 Y축
  volumeChart
    .append('g')
    .attr('class', 'volume-y-axis')
    .call(
      d3
        .axisLeft(volumeY)
        .ticks(3)
        .tickFormat((d) => {
          const value = Number(d);
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
          return value.toString();
        }),
    )
    .selectAll('text')
    .style('fill', colors.axisText)
    .style('font-size', '10px');

  // 캔들 너비 계산
  const candleWidth = Math.max(Math.min(width / (sortedData.length + 2), 15), 2);
  const volumeWidth = candleWidth * 0.8;

  // 캔들 그리기
  const candles = priceChart
    .selectAll('.candle')
    .data(sortedData)
    .enter()
    .append('g')
    .attr('class', 'candle')
    .attr('transform', (d) => `translate(${x(new Date(d.timestamp))}, 0)`);

  // 캔들 꼬리
  candles
    .append('line')
    .attr('class', 'wick')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', (d) => y(d.high))
    .attr('y2', (d) => y(d.low))
    .attr('stroke', (d) =>
      d.close > d.open
        ? colors.upCandle
        : d.close < d.open
          ? colors.downCandle
          : colors.neutralCandle,
    )
    .attr('stroke-width', 1);

  // 캔들 몸통
  candles
    .append('rect')
    .attr('class', 'body')
    .attr('x', -candleWidth / 2)
    .attr('y', (d) => y(Math.max(d.open, d.close)))
    .attr('width', candleWidth)
    .attr('height', (d) => Math.max(1, Math.abs(y(d.open) - y(d.close))))
    .attr('fill', (d) =>
      d.close > d.open
        ? colors.upCandle
        : d.close < d.open
          ? colors.downCandle
          : colors.neutralCandle,
    );

  // 거래량 막대 그리기
  volumeChart
    .selectAll('.volume-bar')
    .data(sortedData)
    .enter()
    .append('rect')
    .attr('class', 'volume-bar')
    .attr('x', (d) => x(new Date(d.timestamp)) - volumeWidth / 2)
    .attr('y', (d) => volumeY(d.volume || 0))
    .attr('width', volumeWidth)
    .attr('height', (d) => volumeHeight - volumeY(d.volume || 0))
    .attr('fill', (d) =>
      d.close > d.open
        ? colors.upVolume
        : d.close < d.open
          ? colors.downVolume
          : colors.neutralCandle,
    )
    .attr('opacity', 0.8);

  // 현재 가격 레이블
  const currentPriceLabel = priceChart
    .append('text')
    .attr('class', 'current-price-label')
    .attr('x', width + 5)
    .attr('fill', 'white')
    .attr('font-size', 11)
    .style('display', 'none');

  // 마우스 이벤트 영역
  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mousemove', function (event) {
      const [mouseX, mouseY] = d3.pointer(event);

      // 마우스가 차트 영역 내에 있는지 확인
      if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        return;
      }

      // 현재 마우스 위치의 Y값을 가격으로 변환
      if (mouseY <= priceChartHeight) {
        const currentPrice = y.invert(mouseY);
        currentPriceLabel
          .attr('y', mouseY + 4)
          .text(currentPrice.toLocaleString('ko-KR'))
          .style('display', null);
      } else {
        currentPriceLabel.style('display', 'none');
      }

      // 가장 가까운 데이터 포인트 찾기
      const xDate = x.invert(mouseX);
      const bisectDate = d3.bisector((d: RefinedCandle) => new Date(d.timestamp)).left;
      const index = bisectDate(sortedData, xDate);
      const d0 = sortedData[index - 1];
      const d1 = sortedData[index];

      if (!d0 || !d1) return;

      const d =
        xDate.getTime() - new Date(d0.timestamp).getTime() >
        new Date(d1.timestamp).getTime() - xDate.getTime()
          ? d1
          : d0;
    });

  // 스타일링 적용
  d3.selectAll('.domain').attr('stroke', colors.gridLines);
  d3.selectAll('.tick line').attr('stroke', colors.gridLines);
};

export default drawUpbitCandleChart;
