/**
 * 信令消息类型
 */
export enum SignalType {
  // 连接相关
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  HEARTBEAT = 'heartbeat',

  // WebRTC 相关
  OFFER = 'offer',
  ANSWER = 'answer',
  ICE_CANDIDATE = 'ice-candidate',

  // 房间管理
  JOIN_ROOM = 'join-room',
  LEAVE_ROOM = 'leave-room',
  ROOM_USERS = 'room-users',

  // 消息传递
  MESSAGE = 'message',
  BROADCAST = 'broadcast',

  // 错误处理
  ERROR = 'error',
}

/**
 * 信令消息基础接口
 */
export interface SignalMessage {
  id: string;
  type: SignalType;
  timestamp: number;
  from?: string;
  to?: string;
  room?: string;
  data?: any;
}

/**
 * WebRTC 会话描述
 */
export interface SessionDescription {
  type: 'offer' | 'answer';
  sdp: string;
}

/**
 * WebRTC ICE 候选
 */
export interface IceCandidate {
  candidate: string;
  sdpMLineIndex?: number | null;
  sdpMid?: string | null;
}

/**
 * WebRTC 相关消息
 */
export interface RTCSignalMessage extends SignalMessage {
  type: SignalType.OFFER | SignalType.ANSWER | SignalType.ICE_CANDIDATE;
  data: {
    sdp?: SessionDescription;
    candidate?: IceCandidate;
  };
}

/**
 * 房间相关消息
 */
export interface RoomSignalMessage extends SignalMessage {
  type: SignalType.JOIN_ROOM | SignalType.LEAVE_ROOM | SignalType.ROOM_USERS;
  room: string;
  data?: {
    users?: string[];
    userInfo?: UserInfo;
  };
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
}

/**
 * 连接状态
 */
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * 信令服务配置
 */
export interface SignallingConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  timeout?: number;
  protocols?: string[];
}

/**
 * 信令服务事件
 */
export interface SignallingEvents {
  'connection-state-changed': (state: ConnectionState) => void;
  'message-received': (message: SignalMessage) => void;
  'user-joined': (user: UserInfo) => void;
  'user-left': (userId: string) => void;
  'room-users-updated': (users: UserInfo[]) => void;
  error: (error: Error) => void;
}

/**
 * 信令客户端接口
 */
export interface ISignallingClient {
  connect(config: SignallingConfig): Promise<void>;
  disconnect(): void;
  sendMessage(message: Omit<SignalMessage, 'id' | 'timestamp'>): void;
  joinRoom(roomId: string, userInfo: UserInfo): void;
  leaveRoom(roomId: string): void;
  getConnectionState(): ConnectionState;
  on<K extends keyof SignallingEvents>(
    event: K,
    listener: SignallingEvents[K]
  ): void;
  off<K extends keyof SignallingEvents>(
    event: K,
    listener: SignallingEvents[K]
  ): void;
}

/**
 * 信令服务接口
 */
export interface ISignallingService {
  initialize(): void;
  createClient(clientId: string): ISignallingClient;
  removeClient(clientId: string): void;
  getClient(clientId: string): ISignallingClient | undefined;
  getAllClients(): Map<string, ISignallingClient>;
}
