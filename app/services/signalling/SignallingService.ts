import { ipcMain } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import type {
  ISignallingService,
  ISignallingClient,
  SignallingConfig,
  SignalMessage,
  UserInfo,
} from './types';
import { SignallingClient } from './client';

/**
 * 信令服务主类
 * 负责管理多个信令客户端实例和 IPC 通信
 */
export class SignallingService implements ISignallingService {
  private clients = new Map<string, ISignallingClient>();

  /**
   * 初始化服务
   */
  initialize(): void {
    this.setupIpcHandlers();
  }

  /**
   * 创建信令客户端
   */
  createClient(clientId: string): ISignallingClient {
    if (this.clients.has(clientId)) {
      throw new Error(`客户端 ${clientId} 已存在`);
    }

    const client = new SignallingClient(clientId);
    this.clients.set(clientId, client);
    return client;
  }

  /**
   * 移除信令客户端
   */
  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.disconnect();
      this.clients.delete(clientId);
    }
  }

  /**
   * 获取信令客户端
   */
  getClient(clientId: string): ISignallingClient | undefined {
    return this.clients.get(clientId);
  }

  /**
   * 获取所有客户端
   */
  getAllClients(): Map<string, ISignallingClient> {
    return new Map(this.clients);
  }

  /**
   * 设置 IPC 处理器
   */
  private setupIpcHandlers(): void {
    // 创建信令客户端
    ipcMain.handle(
      'signalling:create-client',
      async (_event: IpcMainInvokeEvent, clientId: string) => {
        try {
          this.createClient(clientId);
          return { success: true, clientId };
        } catch (error) {
          return { success: false, error: (error as Error).message };
        }
      }
    );

    // 连接到信令服务器
    ipcMain.handle(
      'signalling:connect',
      async (
        _event: IpcMainInvokeEvent,
        clientId: string,
        config: SignallingConfig
      ) => {
        try {
          const client = this.getClient(clientId);
          if (!client) {
            throw new Error(`客户端 ${clientId} 不存在`);
          }
          await client.connect(config);
          return { success: true };
        } catch (error) {
          return { success: false, error: (error as Error).message };
        }
      }
    );

    // 断开连接
    ipcMain.handle(
      'signalling:disconnect',
      async (_event: IpcMainInvokeEvent, clientId: string) => {
        try {
          const client = this.getClient(clientId);
          if (!client) {
            throw new Error(`客户端 ${clientId} 不存在`);
          }
          client.disconnect();
          return { success: true };
        } catch (error) {
          return { success: false, error: (error as Error).message };
        }
      }
    );

    // 发送消息
    ipcMain.handle(
      'signalling:send-message',
      async (
        _event: IpcMainInvokeEvent,
        clientId: string,
        message: Omit<SignalMessage, 'id' | 'timestamp'>
      ) => {
        try {
          const client = this.getClient(clientId);
          if (!client) {
            throw new Error(`客户端 ${clientId} 不存在`);
          }
          client.sendMessage(message);
          return { success: true };
        } catch (error) {
          return { success: false, error: (error as Error).message };
        }
      }
    );

    // 加入房间
    ipcMain.handle(
      'signalling:join-room',
      async (
        _event: IpcMainInvokeEvent,
        clientId: string,
        roomId: string,
        userInfo: UserInfo
      ) => {
        try {
          const client = this.getClient(clientId);
          if (!client) {
            throw new Error(`客户端 ${clientId} 不存在`);
          }
          client.joinRoom(roomId, userInfo);
          return { success: true };
        } catch (error) {
          return { success: false, error: (error as Error).message };
        }
      }
    );

    // 离开房间
    ipcMain.handle(
      'signalling:leave-room',
      async (_event: IpcMainInvokeEvent, clientId: string, roomId: string) => {
        try {
          const client = this.getClient(clientId);
          if (!client) {
            throw new Error(`客户端 ${clientId} 不存在`);
          }
          client.leaveRoom(roomId);
          return { success: true };
        } catch (error) {
          return { success: false, error: (error as Error).message };
        }
      }
    );

    // 获取连接状态
    ipcMain.handle(
      'signalling:get-connection-state',
      async (_event: IpcMainInvokeEvent, clientId: string) => {
        try {
          const client = this.getClient(clientId);
          if (!client) {
            throw new Error(`客户端 ${clientId} 不存在`);
          }
          const state = client.getConnectionState();
          return { success: true, state };
        } catch (error) {
          return { success: false, error: (error as Error).message };
        }
      }
    );

    // 移除客户端
    ipcMain.handle(
      'signalling:remove-client',
      async (_event: IpcMainInvokeEvent, clientId: string) => {
        try {
          this.removeClient(clientId);
          return { success: true };
        } catch (error) {
          return { success: false, error: (error as Error).message };
        }
      }
    );

    // 获取所有客户端ID
    ipcMain.handle('signalling:get-all-clients', async () => {
      try {
        const clientIds = Array.from(this.clients.keys());
        return { success: true, clientIds };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    });
  }

  /**
   * 清理资源
   */
  destroy(): void {
    // 断开所有客户端连接
    for (const [, client] of this.clients) {
      client.disconnect();
    }
    this.clients.clear();

    // 移除 IPC 处理器
    ipcMain.removeAllListeners('signalling:create-client');
    ipcMain.removeAllListeners('signalling:connect');
    ipcMain.removeAllListeners('signalling:disconnect');
    ipcMain.removeAllListeners('signalling:send-message');
    ipcMain.removeAllListeners('signalling:join-room');
    ipcMain.removeAllListeners('signalling:leave-room');
    ipcMain.removeAllListeners('signalling:get-connection-state');
    ipcMain.removeAllListeners('signalling:remove-client');
    ipcMain.removeAllListeners('signalling:get-all-clients');
  }
}
