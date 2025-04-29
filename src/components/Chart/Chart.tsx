import { useMarketMutation } from '@/hooks/useMarketMutation';
import { useWebSocketPrice } from '@/hooks/useWebSocket';

const Chart = () => {
  const { market } = useMarketMutation();
  const { latestPrice } = useWebSocketPrice(market);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{market} 시세</h2>
      {latestPrice !== null ? <div>{latestPrice.toLocaleString()} 원</div> : <div>loading</div>}
    </div>
  );
};

export default Chart;
