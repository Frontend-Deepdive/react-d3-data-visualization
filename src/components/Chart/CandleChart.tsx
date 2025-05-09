import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RefinedCandle } from '../../utils/refineCandle';

interface CandleChartProps {
  data: RefinedCandle[];
}

const CandleChart = ({ data }: CandleChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);

  const margin = { top: 20, right: 40, bottom: 30, left: 60 };
  const width = 1200 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // 툴팁 생성 함수
  const createTooltip = () => {
    return d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', 'white')
      .style('padding', '6px 10px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('display', 'none')
      .style('z-index', '10');
  };

  // X, Y 축 그리기 함수
  const drawAxes = (
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleLinear<number, number, never>,
    height: number,
  ) => {
    chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => d3.timeFormat('%H:%M')(new Date(d))));

    chart.append('g').call(d3.axisLeft(yScale));
  };

  // 캔들 그리기 함수
  const drawCandles = (
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: RefinedCandle[],
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleLinear<number, number, never>,
    parseTime: (dateString: string) => Date | null,
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
  ) => {
    chart
      .selectAll('g.candle')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'candle')
      .each(function (d) {
        const group = d3.select(this);
        const time = parseTime(d.timestamp)!;
        const x = xScale(time.toString())!;
        const color = d.close > d.open ? '#1e90ff' : '#ff4d4f';
        const bodyTop = Math.min(yScale(d.open), yScale(d.close));
        const bodyHeight = Math.abs(yScale(d.open) - yScale(d.close));

        group
          .append('line')
          .attr('x1', x + xScale.bandwidth() / 2)
          .attr('x2', x + xScale.bandwidth() / 2)
          .attr('y1', yScale(d.high))
          .attr('y2', yScale(d.low))
          .attr('stroke', color)
          .attr('stroke-width', 1);

        // body
        group
          .append('rect')
          .attr('x', x)
          .attr('y', bodyTop)
          .attr('width', xScale.bandwidth())
          .attr('height', bodyHeight || 1)
          .attr('fill', color)
          .on('mouseenter', function () {
            tooltip
              .style('display', 'block')
              .html(
                `<div><strong>시가:</strong> ${d.open}원</div><div><strong>종가:</strong> ${d.close}원</div>`,
              );
            setHoveredPrice(d.close);
          })
          .on('mousemove', function (event) {
            tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 28 + 'px');
          })
          .on('mouseleave', function () {
            tooltip.style('display', 'none');
            setHoveredPrice(null);
          });
      });
  };

  const drawPriceLine = (
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    hoveredPrice: number | null,
    yScale: d3.ScaleLinear<number, number, never>,
    width: number,
  ) => {
    chart.selectAll('.price-line').remove();

    if (hoveredPrice !== null) {
      chart
        .append('line')
        .attr('class', 'price-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(hoveredPrice))
        .attr('y2', yScale(hoveredPrice))
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4');
    }
  };

  const initChart = (
    data: RefinedCandle[],
    svgRef: React.RefObject<SVGSVGElement>,
    hoveredPrice: number | null,
  ) => {
    if (!svgRef.current) return;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const parseTime = d3.isoParse;
    const timestamps = data.map((d) => parseTime(d.timestamp)!);

    const xScale = d3
      .scaleBand()
      .domain(timestamps.map((d) => d.toString()))
      .range([0, width])
      .padding(0.3);

    const yMin = d3.min(data, (d) => d.low)!;
    const yMax = d3.max(data, (d) => d.high)!;

    const yScale = d3
      .scaleLinear()
      .domain([yMin - (yMax - yMin) * 0.1, yMax + (yMax - yMin) * 0.1])
      .range([height, 0]);

    const tooltip = createTooltip();

    drawAxes(chart, xScale, yScale, height);
    drawCandles(chart, data, xScale, yScale, parseTime, tooltip);
    drawPriceLine(chart, hoveredPrice, yScale, width);

    return tooltip;
  };

  useEffect(() => {
    if (!data.length) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const tooltip = initChart(data, svgRef, hoveredPrice);

    return () => {
      tooltip?.remove();
    };
  }, [data, hoveredPrice]);

  return <svg ref={svgRef} />;
};

export default CandleChart;
