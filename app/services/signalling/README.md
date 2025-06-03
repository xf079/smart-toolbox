# 信令服务 (Signalling Service)

信令服务是一个用于 WebRTC 通信和实时消息传递的完整解决方案，支持多客户端管理、房间管理、自动重连等功能。

## 功能特性

- 🔌 **WebSocket 连接管理** - 支持连接、断开、自动重连
- 💬 **消息传递** - 支持点对点和广播消息
- 🏠 **房间管理** - 支持加入/离开房间，用户管理
- 🔄 **WebRTC 支持** - 内置 WebRTC 信令消息类型
- 💓 **心跳机制** - 自动心跳保持连接活跃
- 🔧 **多客户端** - 支持同时管理多个信令客户端
- 📡 **IPC 集成** - 与 Electron 主进程无缝集成

## 架构设计

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Renderer      │    │   Main Process   │    │  Signalling     │
│   Process       │◄──►│   IpcService     │◄──►│  Server         │
│                 │    │                  │    │                 │
│ - UI Components │    │ - SignallingService │  │ - WebSocket     │
│ - Event Handlers│    │ - SignallingClient  │  │ - Room Management│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 快速开始

### 1. 在主进程中初始化服务

```typescript
import { SignallingService } from './services/signalling';

// 在 app/index.ts 中
const signallingService = new SignallingService();
signallingService.initialize();
```

### 2. 在渲染进程中使用

```typescript
// 创建客户端
const result = await window.electronAPI.invoke('signalling:create-client', 'client-1');

// 连接到服务器
await window.electronAPI.invoke('signalling:connect', 'client-1', {
  url: 'ws://localhost:8080',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
});

// 加入房间
await window.electronAPI.invoke('signalling:join-room', 'client-1', 'room-123', {
  id: 'user-1',
  name: '张三',
  status: 'online'
});

// 发送消息
await window.electronAPI.invoke('signalling:send-message', 'client-1', {
  type: 'message',
  to: 'user-2',
  data: { text: 'Hello World!' }
});
```

## API 参考

### SignallingService

主要的信令服务类，负责管理多个客户端实例。

#### 方法

- `initialize()` - 初始化服务和 IPC 处理器
- `createClient(clientId: string)` - 创建新的信令客户端
- `removeClient(clientId: string)` - 移除指定客户端
- `getClient(clientId: string)` - 获取指定客户端
- `getAllClients()` - 获取所有客户端
- `destroy()` - 清理资源

### SignallingClient

单个信令客户端实例，处理与服务器的连接和消息传递。

#### 方法

- `connect(config: SignallingConfig)` - 连接到信令服务器
- `disconnect()` - 断开连接
- `sendMessage(message)` - 发送消息
- `joinRoom(roomId, userInfo)` - 加入房间
- `leaveRoom(roomId)` - 离开房间
- `getConnectionState()` - 获取连接状态

#### 事件

- `connection-state-changed` - 连接状态变化
- `message-received` - 收到消息
- `user-joined` - 用户加入房间
- `user-left` - 用户离开房间
- `room-users-updated` - 房间用户列表更新
- `error` - 错误事件

## 消息类型

### 基础消息类型

```typescript
enum SignalType {
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
```

### WebRTC 信令示例

```typescript
// 发送 Offer
await window.electronAPI.invoke('signalling:send-message', 'client-1', {
  type: 'offer',
  to: 'user-2',
  data: {
    sdp: {
      type: 'offer',
      sdp: '...'
    }
  }
});

// 发送 ICE Candidate
await window.electronAPI.invoke('signalling:send-message', 'client-1', {
  type: 'ice-candidate',
  to: 'user-2',
  data: {
    candidate: {
      candidate: '...',
      sdpMLineIndex: 0,
      sdpMid: 'audio'
    }
  }
});
```

## 配置选项

```typescript
interface SignallingConfig {
  url: string;                    // WebSocket 服务器地址
  reconnectInterval?: number;     // 重连间隔 (默认: 3000ms)
  maxReconnectAttempts?: number;  // 最大重连次数 (默认: 5)
  heartbeatInterval?: number;     // 心跳间隔 (默认: 30000ms)
  timeout?: number;               // 连接超时 (默认: 10000ms)
  protocols?: string[];           // WebSocket 协议
}
```

## 错误处理

服务提供了完善的错误处理机制：

```typescript
// 所有 IPC 调用都返回统一的响应格式
interface IpcResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// 使用示例
const result = await window.electronAPI.invoke('signalling:connect', 'client-1', config);
if (!result.success) {
  console.error('连接失败:', result.error);
}
```

## 最佳实践

1. **客户端管理** - 为每个用户会话创建独立的客户端ID
2. **错误处理** - 始终检查 IPC 调用的返回结果
3. **资源清理** - 在应用关闭时调用 `destroy()` 方法
4. **重连策略** - 根据网络环境调整重连参数
5. **消息验证** - 在发送前验证消息格式的正确性

## 扩展开发

如需扩展功能，可以：

1. 在 `types.ts` 中添加新的消息类型
2. 在 `SignallingClient.ts` 中添加消息处理逻辑
3. 在 `SignallingService.ts` 中添加新的 IPC 处理器
4. 更新接口定义以支持新功能

## 注意事项

- 确保 WebSocket 服务器支持相应的消息协议
- 在生产环境中使用 WSS (安全 WebSocket) 连接
- 合理设置心跳和重连参数以平衡性能和可靠性
- 注意处理网络异常和服务器断开的情况 