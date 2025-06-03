import { contextBridge, ipcRenderer } from 'electron';

// 定义暴露给渲染进程的API接口
export interface ElectronAPI {
  // 窗口管理
  window: {
    createSettings: () => Promise<void>;
    createAbout: () => Promise<void>;
    createMain: () => Promise<void>;
    closeCurrent: () => Promise<void>;
    minimizeCurrent: () => Promise<void>;
    maximizeCurrent: () => Promise<void>;
  };

  // 应用信息
  app: {
    getVersion: () => Promise<string>;
    getName: () => Promise<string>;
  };

  // 系统信息
  system: {
    getPlatform: () => Promise<string>;
    getArch: () => Promise<string>;
  };

  // 开发工具
  dev: {
    toggleDevTools: () => Promise<void>;
  };

  // 消息处理
  message: {
    log: (level: string, message: string) => void;
  };
}

// 创建API对象
const electronAPI: ElectronAPI = {
  window: {
    createSettings: () => ipcRenderer.invoke('window:create-settings'),
    createAbout: () => ipcRenderer.invoke('window:create-about'),
    createMain: () => ipcRenderer.invoke('window:create-main'),
    closeCurrent: () => ipcRenderer.invoke('window:close-current'),
    minimizeCurrent: () => ipcRenderer.invoke('window:minimize-current'),
    maximizeCurrent: () => ipcRenderer.invoke('window:maximize-current'),
  },

  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    getName: () => ipcRenderer.invoke('app:get-name'),
  },

  system: {
    getPlatform: () => ipcRenderer.invoke('system:get-platform'),
    getArch: () => ipcRenderer.invoke('system:get-arch'),
  },

  dev: {
    toggleDevTools: () => ipcRenderer.invoke('dev:toggle-devtools'),
  },

  message: {
    log: (level: string, message: string) => {
      ipcRenderer.send('message:log', level, message);
    },
  },
};

// 将API暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// 类型声明，供TypeScript使用
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
