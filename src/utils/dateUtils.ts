/**
 * 주어진 날짜 값을 ISO 8601 포맷 문자열로 변환
 * @param {string | Date} date - 변환할 날짜 (문자열 또는 Date 객체)
 * @returns {string} - ISO 8601 형식의 날짜 문자열
 */
export const toISOString = (date: string | Date): string => {
  return new Date(date).toISOString();
};

/**
 * 주어진 날짜 값을 'HH:MM' 형식의 시간 문자열로 변환
 * - 분이 10 미만일 경우 두 자릿수로 맞추기 위해 앞에 0을 추가
 * @param {Date} timestamp - 변환할 날짜 객체
 * @returns {string} - 'HH:MM' 형식의 시간 문자열
 */
export const transformTimeformat = (timestamp: Date) => {
  const hours = timestamp.getHours(); // 시간 추출
  const minutes = timestamp.getMinutes(); // 분 추출
  return `${hours}:${String(minutes).padStart(2, '0')}`;
};
