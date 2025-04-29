import { useGetCandle } from '../apis/api/get/useGetCandle';

function CandleData() {
  const candleData = useGetCandle();
  console.log(candleData.data!.data);
  return <div>CandleData</div>;
}

export default CandleData;
