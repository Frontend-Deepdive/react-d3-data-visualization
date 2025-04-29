import { useGetCandle } from '../apis/api/get/useGetCandle';

function CandleData() {
  const candleDataSeconds = useGetCandle({
    unit: 'seconds',
    marketCode: 'KRW-BTC',
    count: 5,
  });
  const candleDataMinutes = useGetCandle({
    unit: 'minutes',
    minute: 3,
    marketCode: 'KRW-BTC',
    count: 3,
  });
  console.log('seconds', candleDataSeconds.data?.data);
  console.log('minutes', candleDataMinutes.data?.data);
  return (
    <div>
      <h1>CandleData</h1>
    </div>
  );
}

export default CandleData;
