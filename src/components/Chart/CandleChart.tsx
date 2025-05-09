// CandleChart.tsx (기본 렌더링만 포함)
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RefinedCandle } from '../../utils/refineCandle';

interface CandleChartProps {
  data: RefinedCandle[];
}

const CandleChart = ({ data }: CandleChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const margin = { top: 20, right: 40, bottom: 30, left: 60 };
  const width = 1200 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const drawAxes = (
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: any,
    yScale: any,
    height: number,
  ) => {
    chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => d3.timeFormat('%H:%M')(new Date(d))));

    chart.append('g').call(d3.axisLeft(yScale));
  };

  const drawCandles = (
    chart: any,
    data: RefinedCandle[],
    xScale: any,
    yScale: any,
    parseTime: any,
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

        group
          .append('rect')
          .attr('x', x)
          .attr('y', bodyTop)
          .attr('width', xScale.bandwidth())
          .attr('height', bodyHeight || 1)
          .attr('fill', color);
      });
  };

  const initChart = (data: RefinedCandle[], svgRef: React.RefObject<SVGSVGElement>) => {
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

    drawAxes(chart, xScale, yScale, height);
    drawCandles(chart, data, xScale, yScale, parseTime);
  };

  useEffect(() => {
    if (!data.length) return;
    d3.select(svgRef.current).selectAll('*').remove();
    initChart(data, svgRef);
  }, [data]);

  return <svg ref={svgRef} />;
};

export default CandleChart;
