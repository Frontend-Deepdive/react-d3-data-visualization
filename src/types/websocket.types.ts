export type WebSocketHandler = (event: MessageEvent) => void;
export type WebSocketEventHandler = () => void;

export interface WebSocketInterface {
  send: (data: any) => void;
  close: () => void;
  readonly readyState: number;
}

export interface UseWebSocketOptions {
  onOpen?: WebSocketEventHandler;
  onClose?: WebSocketEventHandler;
  onError?: (event: Event) => void;
  pingIntervalMs?: number;
}
