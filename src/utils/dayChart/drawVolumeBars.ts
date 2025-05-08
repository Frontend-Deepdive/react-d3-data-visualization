import { ExtendedCandle } from '../refineCandle';

//거래량 봉 그래프 그리기 함수
export const drawVolumeBars = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  parsedData: ExtendedCandle[],
  x: d3.ScaleBand<string>,
  yVolume: d3.ScaleLinear<number, number>,
) => {
  svg.selectAll('.volume-bar').remove();

  svg
    .selectAll('.volume-bar')
    .data(parsedData)
    .join('rect')
    .attr('class', 'volume-bar')
    .attr('x', (d) => x(d.dateStr) ?? 0)
    .attr('y', (d) => yVolume(d.volume))
    .attr('width', x.bandwidth())
    .attr('height', (d) => yVolume(0) - yVolume(d.volume))
    .attr('fill', (d) => (d.open >= d.close ? '#0062DF' : '#DD3C44'));
};
