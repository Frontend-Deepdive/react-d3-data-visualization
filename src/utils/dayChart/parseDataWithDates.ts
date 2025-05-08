import { toISOString } from '../dateUtils';
import { ExtendedCandle, RefinedCandle } from '../refineCandle';

// 날짜 데이터 파싱 함수
export const parseDataWithDates = (refinedData: RefinedCandle[]): ExtendedCandle[] => {
  // 날짜 기준 오름 차순 처리
  const sortedData = [...refinedData].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateA - dateB;
  });

  // dates 형식 날짜 기준으로 파싱
  let prevMonth = 0;
  return sortedData.map((d) => {
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
};
