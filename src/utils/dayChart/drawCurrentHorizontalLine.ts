import * as d3 from 'd3';

export const drawCurrentHorizontalLine = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  yScale: d3.ScaleLinear<number, number>,
  price: number,
  width: number,
  margin: { left: number; right: number; top: number; bottom: number },
) => {
  svg.selectAll('.price-line').remove(); // 기존 선 제거

  svg
    .append('line')
    .attr('class', 'price-line') // 나중에 찾기 쉽게 이름 붙임
    .attr('x1', margin.left) // 왼쪽 시작점
    .attr('x2', width - margin.right) // 오른쪽 끝점
    .attr('y1', yScale(price)) // 선의 수직 위치
    .attr('y2', yScale(price)) // 같은 높이니까 y1, y2 같음
    .attr('stroke', 'red') // 빨간색 선
    .attr('stroke-width', 1) // 선 두께
    .attr('stroke-dasharray', '4'); // 점선
};
