import * as d3 from 'd3';
import { RefinedCandle } from '@/utils/refineCandle';

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
  const volumeHeight = 80; // 거래량 차트 높이
  const priceChartHeight = height - volumeHeight - 20; // 가격 차트 높이

  // 색상 테마 (Upbit 스타일)
  const colors = {
    background: '#FFFfff',
    gridLines: '#c9c9c9',
    axisText: '#0c0c0c',
    upCandle: '#ee0000', // 상승 캔들 (빨간색)
    downCandle: '#000fff', // 하락 캔들 (파란색)
    neutralCandle: '#b5b5b5', // 보합 캔들 (회색)
    upVolume: '#ee0000', // 상승 거래량
    downVolume: '#000fff', // 하락 거래량
    tooltip: 'rgba(26, 35, 55, 0.9)',
    crosshair: 'rgba(255, 255, 255, 0.5)',
    basePrice: '#ffcc33', // 기준 가격
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

  // 시간 포맷 변환 함수
  const timeFormat = (timestamp: Date) => {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  };

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
        .tickFormat((d) => timeFormat(d as Date)),
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

  // 툴팁 요소 추가
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'candlestick-tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background', colors.tooltip)
    .style('color', 'white')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('z-index', '10');

  // 크로스헤어 요소
  const crosshairHorizontal = priceChart
    .append('line')
    .attr('class', 'crosshair-h')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('stroke', colors.crosshair)
    .attr('stroke-width', 0.5)
    .style('display', 'none');

  const crosshairVertical = svg
    .append('line')
    .attr('class', 'crosshair-v')
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', colors.crosshair)
    .attr('stroke-width', 0.5)
    .style('display', 'none');

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

      // 크로스헤어 표시
      crosshairHorizontal.attr('y1', mouseY).attr('y2', mouseY);
      // .style('display', mouseY <= priceChartHeight ? null : 'none');

      crosshairVertical.attr('x1', mouseX).attr('x2', mouseX).style('display', null);

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

      // 툴팁 업데이트
      const date = new Date(d.timestamp);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${timeFormat(date)}`;

      tooltip
        .style('visibility', 'visible')
        .style('left', `${event.pageX + 15}px`)
        .style('top', `${event.pageY - 10}px`).html(`
          <div style="margin-bottom: 5px; font-weight: bold;">${formattedDate}</div>
          <div>시가: ${d.open.toLocaleString('ko-KR')}</div>
          <div>고가: ${d.high.toLocaleString('ko-KR')}</div>
          <div>저가: ${d.low.toLocaleString('ko-KR')}</div>
          <div>종가: ${d.close.toLocaleString('ko-KR')}</div>
          <div>거래량: ${(d.volume || 0).toLocaleString('ko-KR')}</div>
        `);
    })
    .on('mouseout', function () {
      tooltip.style('visibility', 'hidden');
      crosshairHorizontal.style('display', 'none');
      crosshairVertical.style('display', 'none');
      currentPriceLabel.style('display', 'none');
    });

  // 스타일링 적용
  d3.selectAll('.domain').attr('stroke', colors.gridLines);
  d3.selectAll('.tick line').attr('stroke', colors.gridLines);
};

export default drawUpbitCandleChart;
