import { ExtendedCandle } from '../refineCandle';
import * as d3 from 'd3';

// 선과 점 그리기 함수
export const drawLineAndPoints = (
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
