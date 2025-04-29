import { useQuery } from '@tanstack/react-query';
import { baseApi } from '../../axios';

type Unit = 'seconds' | 'minutes' | 'days' | 'weeks' | 'months' | 'years';

interface CommonProps {
  marketCode: string;
  count: number;
}

interface MinutesProps extends CommonProps {
  unit: 'minutes';
  minute: 1 | 3 | 5 | 10 | 15 | 30 | 60 | 240;
}

interface OtherProps extends CommonProps {
  unit: Exclude<Unit, 'minutes'>;
}

/**
 * 캔들 데이터를 가져오는 커스텀 훅
 *
 * - unit이 'minutes'일 경우, 추가로 'minute' 값을 지정해야 합니다. (1, 3, 5, 10, 15, 30, 60, 240 중 하나)
 * - 나머지 unit ('seconds', 'days', 'weeks', 'months', 'years')는 별도 minute 없이 호출됩니다.
 *
 * @param props - 캔들 데이터 요청에 필요한 정보 (unit, marketCode, count 등)
 * @returns 서버에서 받아온 캔들 데이터 쿼리 결과
 */
export const useGetCandle = (props: MinutesProps | OtherProps) => {
  return useQuery({
    queryKey: ['candle', props],

    queryFn: async () => {
      const queryParams = `?market=${props.marketCode}&count=${props.count}`;

      const url =
        props.unit === 'minutes' ? `/candles/minutes/${props.minute}` : `/candles/${props.unit}`;

      const { data } = await baseApi.get(url + queryParams); 
      
      return data;  

    },
  });
};