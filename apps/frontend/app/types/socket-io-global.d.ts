type SocketHandler = (payload: unknown) => void;

type SocketClient = {
  on: (eventName: string, handler: SocketHandler) => void;
  off: (eventName: string, handler: SocketHandler) => void;
  disconnect: () => void;
};

type SocketFactory = (url: string, options?: Record<string, unknown>) => SocketClient;

interface Window {
  io?: SocketFactory;
}
