import * as d3 from 'd3';
import { RefinedCandle } from '@/utils/refineCandle';
import CHART_SECOND_COLOR from '@/constants/chartSecondColor';
import { transformTimeformat } from '@/utils/dateUtils';

export const drawGrid = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>,
  width: number,
  height: number,
) => {
  svg
    .append('g')
    .selectAll('line')
    .data(y.ticks(6))
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', (d) => y(d))
    .attr('y2', (d) => y(d))
    .attr('stroke', CHART_SECOND_COLOR.gridLines)
    .attr('stroke-width', 0.5);

  svg
    .append('g')
    .selectAll('line')
    .data(x.ticks(12))
    .enter()
    .append('line')
    .attr('x1', (d) => x(d))
    .attr('x2', (d) => x(d))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', CHART_SECOND_COLOR.gridLines)
    .attr('stroke-width', 0.5);
};

export const drawAxes = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>,
  width: number,
  fullHeight: number,
  priceChartHeight: number,
) => {
  svg
    .append('g')
    .attr('transform', `translate(0, ${fullHeight})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(8)
        .tickFormat((d) => transformTimeformat(d as Date)),
    )
    .selectAll('text')
    .style('fill', CHART_SECOND_COLOR.axisText)
    .style('font-size', '11px');

  svg
    .append('g')
    .attr('transform', `translate(${width}, 0)`)
    .call(
      d3
        .axisRight(y)
        .ticks(5)
        .tickFormat((d) => d.toLocaleString('ko-KR')),
    )
    .selectAll('text')
    .style('fill', CHART_SECOND_COLOR.axisText)
    .style('font-size', '11px');
};

export const drawCandles = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>,
  data: RefinedCandle[],
  candleWidth: number,
) => {
  const candles = svg
    .selectAll('.candle')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'candle')
    .attr('transform', (d) => `translate(${x(new Date(d.timestamp))}, 0)`);

  candles
    .append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', (d) => y(d.high))
    .attr('y2', (d) => y(d.low))
    .attr('stroke', (d) =>
      d.close > d.open
        ? CHART_SECOND_COLOR.upCandle
        : d.close < d.open
          ? CHART_SECOND_COLOR.downCandle
          : CHART_SECOND_COLOR.neutralCandle,
    )
    .attr('stroke-width', 1);

  candles
    .append('rect')
    .attr('x', -candleWidth / 2)
    .attr('y', (d) => y(Math.max(d.open, d.close))) // 몸통의 위쪽 (시가가 더 높으면 시가가 위)
    .attr('width', candleWidth)
    .attr('height', (d) => Math.max(1, Math.abs(y(d.open) - y(d.close)))) // 시가-종가 거리
    .attr('fill', (d) =>
      d.close > d.open
        ? CHART_SECOND_COLOR.upCandle
        : d.close < d.open
          ? CHART_SECOND_COLOR.downCandle
          : CHART_SECOND_COLOR.neutralCandle,
    );
};

export const drawPriceLabels = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  y: d3.ScaleLinear<number, number>,
  basePrice: number,
  width: number,
) => {
  svg
    .append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(basePrice))
    .attr('y2', y(basePrice))
    .attr('stroke', CHART_SECOND_COLOR.basePrice)
    .attr('stroke-dasharray', '3,3')
    .attr('stroke-width', 1);

  svg
    .append('text')
    .attr('x', width + 5)
    .attr('y', y(basePrice) + 4)
    .attr('fill', CHART_SECOND_COLOR.basePrice)
    .attr('font-size', 11)
    .text(basePrice.toLocaleString('ko-KR'));
};
