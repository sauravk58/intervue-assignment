export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  
  constructor(url: string = import.meta.env.VITE_WS_URL) {
    this.url = url;
  }

  connect(
    onOpen?: () => void,
    onMessage?: (data: any) => void,
    onClose?: () => void,
    onError?: (error: Event) => void
  ) {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        onOpen?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        onClose?.();
        this.attemptReconnect(onOpen, onMessage, onClose, onError);
      };

      this.ws.onerror = (error) => {
        onError?.(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      onError?.(error as Event);
    }
  }

  private attemptReconnect(
    onOpen?: () => void,
    onMessage?: (data: any) => void,
    onClose?: () => void,
    onError?: (error: Event) => void
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(onOpen, onMessage, onClose, onError);
      }, delay);
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  get readyState() {
    return this.ws?.readyState || WebSocket.CLOSED;
  }
}
