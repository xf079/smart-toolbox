/**
 * 信令服务使用示例
 *
 * 这个文件展示了如何在渲染进程中使用信令服务
 * 注意：这些代码应该在渲染进程中运行，需要通过 IPC 与主进程通信
 */

import type { SignalType, ConnectionState, UserInfo } from './types';

// 假设 electronAPI 已经在 preload 脚本中暴露
declare global {
  interface Window {
    electronAPI: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

/**
 * 信令客户端包装类
 * 封装了与主进程的 IPC 通信
 */
export class SignallingClientWrapper {
  constructor(private clientId: string) {}

  /**
   * 创建客户端
   */
  static async create(clientId: string): Promise<SignallingClientWrapper> {
    const result = await window.electronAPI.invoke(
      'signalling:create-client',
      clientId
    );
    if (!result.success) {
      throw new Error(`创建客户端失败: ${result.error}`);
    }
    return new SignallingClientWrapper(clientId);
  }

  /**
   * 连接到信令服务器
   */
  async connect(config: {
    url: string;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    heartbeatInterval?: number;
    timeout?: number;
    protocols?: string[];
  }): Promise<void> {
    const result = await window.electronAPI.invoke(
      'signalling:connect',
      this.clientId,
      config
    );
    if (!result.success) {
      throw new Error(`连接失败: ${result.error}`);
    }
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    const result = await window.electronAPI.invoke(
      'signalling:disconnect',
      this.clientId
    );
    if (!result.success) {
      throw new Error(`断开连接失败: ${result.error}`);
    }
  }

  /**
   * 发送消息
   */
  async sendMessage(message: {
    type: string;
    to?: string;
    room?: string;
    data?: any;
  }): Promise<void> {
    const result = await window.electronAPI.invoke(
      'signalling:send-message',
      this.clientId,
      message
    );
    if (!result.success) {
      throw new Error(`发送消息失败: ${result.error}`);
    }
  }

  /**
   * 加入房间
   */
  async joinRoom(roomId: string, userInfo: UserInfo): Promise<void> {
    const result = await window.electronAPI.invoke(
      'signalling:join-room',
      this.clientId,
      roomId,
      userInfo
    );
    if (!result.success) {
      throw new Error(`加入房间失败: ${result.error}`);
    }
  }

  /**
   * 离开房间
   */
  async leaveRoom(roomId: string): Promise<void> {
    const result = await window.electronAPI.invoke(
      'signalling:leave-room',
      this.clientId,
      roomId
    );
    if (!result.success) {
      throw new Error(`离开房间失败: ${result.error}`);
    }
  }

  /**
   * 获取连接状态
   */
  async getConnectionState(): Promise<ConnectionState> {
    const result = await window.electronAPI.invoke(
      'signalling:get-connection-state',
      this.clientId
    );
    if (!result.success) {
      throw new Error(`获取连接状态失败: ${result.error}`);
    }
    return result.state;
  }

  /**
   * 移除客户端
   */
  async remove(): Promise<void> {
    const result = await window.electronAPI.invoke(
      'signalling:remove-client',
      this.clientId
    );
    if (!result.success) {
      throw new Error(`移除客户端失败: ${result.error}`);
    }
  }
}

/**
 * 使用示例
 */
export async function exampleUsage() {
  try {
    // 1. 创建客户端
    const client = await SignallingClientWrapper.create('my-client-1');
    console.log('客户端创建成功');

    // 2. 连接到服务器
    await client.connect({
      url: 'ws://localhost:8080',
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
    });
    console.log('连接成功');

    // 3. 加入房间
    await client.joinRoom('room-123', {
      id: 'user-1',
      name: '张三',
      status: 'online',
    });
    console.log('加入房间成功');

    // 4. 发送普通消息
    await client.sendMessage({
      type: 'message',
      to: 'user-2',
      data: { text: 'Hello World!' },
    });
    console.log('消息发送成功');

    // 5. 发送 WebRTC Offer
    await client.sendMessage({
      type: 'offer',
      to: 'user-2',
      data: {
        sdp: {
          type: 'offer',
          sdp: 'v=0\r\no=- 123456789 123456789 IN IP4 127.0.0.1\r\n...',
        },
      },
    });
    console.log('WebRTC Offer 发送成功');

    // 6. 发送 ICE Candidate
    await client.sendMessage({
      type: 'ice-candidate',
      to: 'user-2',
      data: {
        candidate: {
          candidate:
            'candidate:1 1 UDP 2130706431 192.168.1.100 54400 typ host',
          sdpMLineIndex: 0,
          sdpMid: 'audio',
        },
      },
    });
    console.log('ICE Candidate 发送成功');

    // 7. 检查连接状态
    const state = await client.getConnectionState();
    console.log('当前连接状态:', state);

    // 8. 离开房间
    await client.leaveRoom('room-123');
    console.log('离开房间成功');

    // 9. 断开连接
    await client.disconnect();
    console.log('断开连接成功');

    // 10. 移除客户端
    await client.remove();
    console.log('客户端移除成功');
  } catch (error) {
    console.error('操作失败:', error);
  }
}

/**
 * WebRTC 通信示例
 */
export async function webrtcExample() {
  try {
    const client = await SignallingClientWrapper.create('webrtc-client');

    await client.connect({
      url: 'ws://localhost:8080',
    });

    // 模拟 WebRTC 通信流程
    console.log('开始 WebRTC 通信...');

    // 发送 Offer
    await client.sendMessage({
      type: 'offer',
      to: 'remote-peer',
      data: {
        sdp: {
          type: 'offer',
          sdp: '...', // 实际的 SDP 内容
        },
      },
    });

    // 发送 Answer (通常是响应 Offer)
    await client.sendMessage({
      type: 'answer',
      to: 'remote-peer',
      data: {
        sdp: {
          type: 'answer',
          sdp: '...', // 实际的 SDP 内容
        },
      },
    });

    // 发送 ICE Candidates
    await client.sendMessage({
      type: 'ice-candidate',
      to: 'remote-peer',
      data: {
        candidate: {
          candidate: 'candidate:...',
          sdpMLineIndex: 0,
          sdpMid: 'audio',
        },
      },
    });

    console.log('WebRTC 信令交换完成');
  } catch (error) {
    console.error('WebRTC 通信失败:', error);
  }
}

/**
 * 房间管理示例
 */
export async function roomManagementExample() {
  try {
    const client = await SignallingClientWrapper.create('room-client');

    await client.connect({
      url: 'ws://localhost:8080',
    });

    // 加入房间
    await client.joinRoom('meeting-room-1', {
      id: 'user-123',
      name: '李四',
      status: 'online',
      avatar: 'https://example.com/avatar.jpg',
    });

    // 发送房间广播消息
    await client.sendMessage({
      type: 'broadcast',
      room: 'meeting-room-1',
      data: {
        type: 'user-status',
        status: 'speaking',
      },
    });

    // 发送私聊消息
    await client.sendMessage({
      type: 'message',
      to: 'user-456',
      data: {
        text: '私聊消息',
        timestamp: Date.now(),
      },
    });

    console.log('房间管理操作完成');
  } catch (error) {
    console.error('房间管理失败:', error);
  }
}
