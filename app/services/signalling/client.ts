import { EventEmitter } from 'events';
import type {
  ISignallingClient,
  SignallingConfig,
  SignallingEvents,
  SignalMessage,
  UserInfo,
} from './types';
import { SignalType, ConnectionState } from './types';

/**
 * 信令客户端实现
 */
export class SignallingClient
  extends EventEmitter
  implements ISignallingClient
{
  private ws: WebSocket | null = null;
  private config: SignallingConfig | null = null;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private currentRoom: string | null = null;
  private userInfo: UserInfo | null = null;

  constructor(private clientId: string) {
    super();
  }

  /**
   * 连接到信令服务器
   */
  async connect(config: SignallingConfig): Promise<void> {
    this.config = config;
    this.setConnectionState(ConnectionState.CONNECTING);

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(config.url, config.protocols);

        const timeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close();
            reject(new Error('连接超时'));
          }
        }, config.timeout || 10000);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          this.setConnectionState(ConnectionState.CONNECTED);
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = event => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = _event => {
          clearTimeout(timeout);
          this.stopHeartbeat();

          if (this.connectionState !== ConnectionState.DISCONNECTED) {
            this.setConnectionState(ConnectionState.DISCONNECTED);
            this.handleReconnect();
          }
        };

        this.ws.onerror = error => {
          clearTimeout(timeout);
          this.setConnectionState(ConnectionState.ERROR);
          this.emit('error', new Error(`WebSocket 错误: ${error}`));
          reject(error);
        };
      } catch (error) {
        this.setConnectionState(ConnectionState.ERROR);
        reject(error);
      }
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.setConnectionState(ConnectionState.DISCONNECTED);
    this.stopReconnect();
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 发送消息
   */
  sendMessage(message: Omit<SignalMessage, 'id' | 'timestamp'>): void {
    if (this.connectionState !== ConnectionState.CONNECTED || !this.ws) {
      throw new Error('未连接到信令服务器');
    }

    const fullMessage: SignalMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: Date.now(),
      from: this.clientId,
    };

    this.ws.send(JSON.stringify(fullMessage));
  }

  /**
   * 加入房间
   */
  joinRoom(roomId: string, userInfo: UserInfo): void {
    this.currentRoom = roomId;
    this.userInfo = userInfo;

    this.sendMessage({
      type: SignalType.JOIN_ROOM,
      room: roomId,
      data: { userInfo },
    });
  }

  /**
   * 离开房间
   */
  leaveRoom(roomId: string): void {
    if (this.currentRoom === roomId) {
      this.sendMessage({
        type: SignalType.LEAVE_ROOM,
        room: roomId,
      });
      this.currentRoom = null;
      this.userInfo = null;
    }
  }

  /**
   * 获取连接状态
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * 监听事件
   */
  on<K extends keyof SignallingEvents>(
    event: K,
    listener: SignallingEvents[K]
  ): this {
    return super.on(event, listener);
  }

  /**
   * 移除事件监听
   */
  off<K extends keyof SignallingEvents>(
    event: K,
    listener: SignallingEvents[K]
  ): this {
    return super.off(event, listener);
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(data: string): void {
    try {
      const message: SignalMessage = JSON.parse(data);
      this.emit('message-received', message);

      // 处理特定类型的消息
      switch (message.type) {
        case SignalType.HEARTBEAT:
          // 心跳响应，不需要特殊处理
          break;

        case SignalType.JOIN_ROOM:
          if (message.data?.userInfo) {
            this.emit('user-joined', message.data.userInfo);
          }
          break;

        case SignalType.LEAVE_ROOM:
          if (message.from) {
            this.emit('user-left', message.from);
          }
          break;

        case SignalType.ROOM_USERS:
          if (message.data?.users) {
            this.emit('room-users-updated', message.data.users);
          }
          break;

        case SignalType.ERROR:
          this.emit('error', new Error(message.data?.message || '服务器错误'));
          break;

        default:
          // 其他消息类型由上层处理
          break;
      }
    } catch (error) {
      this.emit('error', new Error(`消息解析错误: ${error}`));
    }
  }

  /**
   * 设置连接状态
   */
  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      this.emit('connection-state-changed', state);
    }
  }

  /**
   * 处理重连
   */
  private handleReconnect(): void {
    if (!this.config || this.connectionState === ConnectionState.DISCONNECTED) {
      return;
    }

    const maxAttempts = this.config.maxReconnectAttempts || 5;
    if (this.reconnectAttempts >= maxAttempts) {
      this.setConnectionState(ConnectionState.ERROR);
      this.emit('error', new Error('重连次数超过限制'));
      return;
    }

    this.setConnectionState(ConnectionState.RECONNECTING);
    this.reconnectAttempts++;

    const interval = this.config.reconnectInterval || 3000;
    this.reconnectTimer = setTimeout(() => {
      this.connect(this.config!).catch(error => {
        this.emit('error', error);
      });
    }, interval);
  }

  /**
   * 停止重连
   */
  private stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = 0;
  }

  /**
   * 开始心跳
   */
  private startHeartbeat(): void {
    if (!this.config) return;

    const interval = this.config.heartbeatInterval || 30000;
    this.heartbeatTimer = setInterval(() => {
      if (this.connectionState === ConnectionState.CONNECTED) {
        this.sendMessage({
          type: SignalType.HEARTBEAT,
        });
      }
    }, interval);
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * 生成消息ID
   */
  private generateMessageId(): string {
    return `${this.clientId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
