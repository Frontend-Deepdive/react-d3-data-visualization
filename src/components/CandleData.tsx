import { useGetCandle } from '../apis/api/get/useGetCandle';
import { refineCandleData } from '../utils/refineCandle'; //추가

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

  const refinedSeconds = candleDataSeconds?.data
    ? refineCandleData(candleDataSeconds.data) 
    : [];

  const refinedMinutes = candleDataMinutes?.data
    ? refineCandleData(candleDataMinutes.data) 
    : [];

  console.log('refinedSeconds', refinedSeconds);
  console.log('refinedMinutes', refinedMinutes);
  
  return (
    <div>
      <h1>CandleData</h1>
    </div>
  );
}
export default CandleData;