import { useEffect, useState } from 'react';
import socketUrl from '@/constants/socketUrl';

export const useWebSocketPrice = (market: string) => {
  const [data, setData] = useState<any | null>(null);

  const connectWebSocket = () => {
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log(`소켓 연결됨. 종목명: ${market}`);
      const requestData = [{ ticket: 'test' }, { type: 'ticker', codes: [market] }];
      socket.send(JSON.stringify(requestData));
    };

    socket.onmessage = async (event) => {
      try {
        const text = await (event.data as Blob).text(); // Blob => 문자열로 변환
        const parsed = JSON.parse(text);
        if (parsed.type === 'ticker') {
          setData(parsed);
        }
      } catch (err) {
        console.error(err);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket 에러:', err);
    };

    socket.onclose = () => {
      console.log('WebSocket 연결 종료');
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      // socket.close();
    };
  }, [market]); // market이 바뀌면 소켓 다시 연결

  return { data, reconnect: connectWebSocket };
};
