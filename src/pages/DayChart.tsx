import { useGetCandle } from '@/apis/api/get/useGetCandle';
import { refineCandleData, RefinedCandle, ExtendedCandle } from '@/utils/refineCandle';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { toISOString } from '@/utils/dateUtils';
import * as constants from '../constants/dayChartConstants';

export default function DayChart({
  width = constants.DEFAULT_WIDTH,
  height = constants.DEFAULT_HEIGHT,
  margin = constants.DEFAULT_MARGIN,
}) {
  /**
   * data fetching
   */
  const { data, isSuccess } = useGetCandle({
    unit: constants.CANDLE_UNIT,
    marketCode: constants.MARKET_CODE,
    count: constants.DAY_CANDLE_CNT,
  });

  const [refinedData, setRefinedData] = useState<RefinedCandle[] | null>(null);

  // data fetching 성공 시 데이터 정제 처리
  useEffect(() => {
    if (isSuccess) setRefinedData(refineCandleData(data.data));
  }, [isSuccess]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  /**
   * refinedData가 업데이트 될 때 마다 그래프 그리기
   */
  useEffect(() => {
    console.log('현 refinedData', refinedData);

    if (!refinedData || !refinedData.length) return;

    // 그래프를 그릴 대상 dom
    const svg = d3.select(svgRef.current);

    // 이전 데이터는 clear
    svg.selectAll('.line').remove();
    svg.selectAll('circle').remove();

    // 날짜 기준 오름 차순 처리
    refinedData.sort((a: RefinedCandle, b: RefinedCandle) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateA - dateB;
    });

    // dates 형식 날짜 기준으로 파싱
    let prevMonth = 0;
    let parsedData: ExtendedCandle[] = refinedData.map((d) => {
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

    // x, y 축 스케일
    const x = d3
      .scaleBand() // 카테고리화된 데이터로 scaleBand사용
      .domain(parsedData.map((d) => d.dateStr))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    // y 축 스케일을 위한 min, max 값
    const minValue = d3.min(parsedData, (d) => d.low);
    const maxValue = d3.max(parsedData, (d) => d.high);

    // y축 범위 타입 명시
    const yMin = minValue !== undefined ? minValue * 0.999 : 0;
    const yMax = maxValue !== undefined ? maxValue * 1.001 : 1;

    const y = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height - margin.bottom, margin.top]);

    // 축 생성기
    const xAxis = d3
      .axisBottom(x)
      .tickValues(parsedData.filter((d) => d.isXAxisMark).map((d) => d.dateStr))
      .tickFormat((d) => {
        const [, month] = d.split('-');
        const monthIndex = parseInt(month) - 1;
        return `${constants.MONTH_NAME_ENG[monthIndex]}`; // month name 표시
      });

    const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format('~s'));

    // 축 그리기
    if (gx.current && gy.current) {
      d3.select(gx.current)
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

      d3.select(gy.current).attr('transform', `translate(${margin.left}, 0)`).call(yAxis);
    }

    // 출 생성기
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
      .attr('cx', (d) => (x(d.dateStr) || 0) + x.bandwidth() / 2) // band에 중앙에 위치
      .attr('cy', (d) => y(d.close))
      .attr('r', 1.5)
      .attr('fill', 'tomato');
  }, [refinedData]);

  return (
    <div className="w-full">
      <svg ref={svgRef} width={width} height={height}>
        <g ref={gx} />
        <g ref={gy} />
      </svg>
    </div>
  );
}
