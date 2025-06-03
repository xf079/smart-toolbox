import { contextBridge } from 'electron';

// 创建API对象
const electronAPI = {
  app: {
    getVersion: () =>
      Promise.resolve(process.env.npm_package_version || '1.0.0'),
    getName: () => Promise.resolve('Smart Toolbox'),
  },

  system: {
    getPlatform: () => Promise.resolve(process.platform),
    getArch: () => Promise.resolve(process.arch),
  },
};

// 将API暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

console.log('Main window preload script loaded');
