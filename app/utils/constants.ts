import path from 'node:path';
import { dirname } from './path';

// 窗口配置
export const WINDOW_CONFIGS = {
  MAIN: {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Smart Toolbox',
  },
};

// 预加载脚本路径
export const PRELOAD_SCRIPTS = {
  MAIN: path.join(dirname, 'preload/index.js'),
};

// 开发服务器URL（由Vite提供）
export const DEV_SERVER_URLS = {
  MAIN: process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL,
};

// 生产环境HTML路径
export const HTML_PATHS = {
  MAIN: path.join(dirname, `renderer/main_window/index.html`),
};
