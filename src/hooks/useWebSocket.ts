import { useEffect, useState } from 'react';

export const useWebSocketPrice = (market: string) => {
  const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectWebSocket = () => {
    const socket = new WebSocket('wss://api.upbit.com/websocket/v1');

    socket.onopen = () => {
      console.log(`소켓 연결됨. 종목명: ${market}`);

      const requestData = [{ type: 'ticker', codes: [market] }];

      socket.send(JSON.stringify(requestData));
    };

    socket.onmessage = async (event) => {
      try {
        const blob = event.data as Blob;
        const text = await blob.text(); // Blob => 문자열로 변환
        const parsed = JSON.parse(text);
        setLatestPrice(parsed.trade_price);
      } catch (error) {
        console.error(error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket 에러: ', error);
    };

    socket.onclose = () => {
      console.log('WebSocket 연결 종료');
      setWs(null);
    };

    setWs(socket);
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      ws?.close();
    };
  }, [market]); // market이 바뀌면 소켓 다시 연결

  return { latestPrice, reconnect: connectWebSocket };
};
