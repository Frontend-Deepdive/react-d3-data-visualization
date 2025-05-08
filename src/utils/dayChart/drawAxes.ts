import { ExtendedCandle } from '../refineCandle';
import * as d3 from 'd3';
import * as constants from '../../constants/dayChartConstants';
// 축 생성 및 그리기 함수
export const drawAxes = (
  parsedData: ExtendedCandle[],
  x: d3.ScaleBand<string>,
  yPrice: d3.ScaleLinear<number, number>,
  yVolume: d3.ScaleLinear<number, number>,
  gx: SVGGElement | null,
  gy: SVGGElement | null,
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
) => {
  if (!gx || !gy) return;

  // x축
  const xAxis = d3
    .axisBottom(x)
    .tickValues(parsedData.filter((d) => d.isXAxisMark).map((d) => d.dateStr))
    .tickFormat((d) => {
      const [, month] = d.split('-');
      const monthIndex = parseInt(month) - 1;
      return `${constants.MONTH_NAME_ENG[monthIndex]}`;
    });

  d3.select(gx)
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  // gy 내부 기존 축 그룹 초기화
  d3.select(gy).selectAll('*').remove();

  // 왼쪽: 거래량 y축
  d3.select(gy)
    .append('g')
    .attr('class', 'y-axis-volume')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yVolume).ticks(3).tickFormat(d3.format('.2s')));

  // 오른쪽: 시세 y축
  d3.select(gy)
    .append('g')
    .attr('class', 'y-axis-price')
    .attr('transform', `translate(${width - margin.right}, 0)`)
    .call(d3.axisRight(yPrice).ticks(5).tickFormat(d3.format('~s')));
};
