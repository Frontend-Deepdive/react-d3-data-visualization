/**
 * 주어진 날짜 값을 ISO 8601 포맷 문자열로 변환
 * @param {string | Date} date - 변환할 날짜 (문자열 또는 Date 객체)
 * @returns {string} - ISO 8601 형식의 날짜 문자열
 */
export const toISOString = (date: string | Date): string => {
  return new Date(date).toISOString();
};
