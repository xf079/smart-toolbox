import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { WindowManager } from '../windows/WindowManager';

export class IpcService {
  constructor(private windowManager: WindowManager) {}

  initialize(): void {
    this.setupIpcHandlers();
  }

  private setupIpcHandlers(): void {
    // 窗口管理相关的IPC处理
    ipcMain.handle('window:create-settings', async () => {
      return await this.windowManager.createSettingsWindow();
    });

    ipcMain.handle('window:create-about', async () => {
      return await this.windowManager.createAboutWindow();
    });

    ipcMain.handle('window:create-main', async () => {
      return await this.windowManager.createMainWindow();
    });

    ipcMain.handle('window:close-current', (event: IpcMainInvokeEvent) => {
      const window = this.getWindowFromInvokeEvent(event);
      if (window && !window.isDestroyed()) {
        window.close();
      }
    });

    ipcMain.handle('window:minimize-current', (event: IpcMainInvokeEvent) => {
      const window = this.getWindowFromInvokeEvent(event);
      if (window && !window.isDestroyed()) {
        window.minimize();
      }
    });

    ipcMain.handle('window:maximize-current', (event: IpcMainInvokeEvent) => {
      const window = this.getWindowFromInvokeEvent(event);
      if (window && !window.isDestroyed()) {
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
      }
    });

    // 应用信息相关
    ipcMain.handle('app:get-version', () => {
      return process.env.npm_package_version || '1.0.0';
    });

    ipcMain.handle('app:get-name', () => {
      return 'Smart Toolbox';
    });

    // 系统信息相关
    ipcMain.handle('system:get-platform', () => {
      return process.platform;
    });

    ipcMain.handle('system:get-arch', () => {
      return process.arch;
    });

    // 开发工具相关
    ipcMain.handle('dev:toggle-devtools', (event: IpcMainInvokeEvent) => {
      const window = this.getWindowFromInvokeEvent(event);
      if (window && !window.isDestroyed()) {
        window.webContents.toggleDevTools();
      }
    });

    // 通用消息处理
    ipcMain.on(
      'message:log',
      (_event: IpcMainEvent, level: string, message: string) => {
        console.log(`[${level.toUpperCase()}] ${message}`);
      }
    );
  }

  /**
   * 从IPC invoke事件中获取对应的窗口
   */
  private getWindowFromInvokeEvent(event: IpcMainInvokeEvent) {
    const webContents = event.sender;
    const windows = this.windowManager.getAllWindows();
    return windows.find(window => window.webContents === webContents) || null;
  }
}
