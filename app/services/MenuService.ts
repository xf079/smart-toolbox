import { Menu, MenuItemConstructorOptions, shell } from 'electron';
import { WindowManager } from '../windows/WindowManager';

export class MenuService {
  constructor(private windowManager: WindowManager) {}

  initialize(): void {
    const template = this.createMenuTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private createMenuTemplate(): MenuItemConstructorOptions[] {
    const isMac = process.platform === 'darwin';

    const template: MenuItemConstructorOptions[] = [
      // macOS应用菜单
      ...(isMac
        ? [
            {
              label: 'Smart Toolbox',
              submenu: [
                {
                  label: 'About Smart Toolbox',
                  click: () => this.windowManager.createAboutWindow(),
                },
                { type: 'separator' as const },
                {
                  label: 'Preferences...',
                  accelerator: 'Cmd+,',
                  click: () => this.windowManager.createSettingsWindow(),
                },
                { type: 'separator' as const },
                { role: 'services' as const },
                { type: 'separator' as const },
                { role: 'hide' as const },
                { role: 'hideOthers' as const },
                { role: 'unhide' as const },
                { type: 'separator' as const },
                { role: 'quit' as const },
              ],
            },
          ]
        : []),

      // 文件菜单
      {
        label: 'File',
        submenu: [
          {
            label: 'New Window',
            accelerator: 'CmdOrCtrl+N',
            click: () => this.windowManager.createMainWindow(),
          },
          { type: 'separator' },
          ...(isMac
            ? [{ role: 'close' as const }]
            : [
                {
                  label: 'Settings',
                  accelerator: 'Ctrl+,',
                  click: () => this.windowManager.createSettingsWindow(),
                },
                { type: 'separator' as const },
                { role: 'quit' as const },
              ]),
        ],
      },

      // 编辑菜单
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          ...(isMac
            ? [
                { role: 'pasteAndMatchStyle' as const },
                { role: 'delete' as const },
                { role: 'selectAll' as const },
                { type: 'separator' as const },
                {
                  label: 'Speech',
                  submenu: [
                    { role: 'startSpeaking' as const },
                    { role: 'stopSpeaking' as const },
                  ],
                },
              ]
            : [
                { role: 'delete' as const },
                { type: 'separator' as const },
                { role: 'selectAll' as const },
              ]),
        ],
      },

      // 视图菜单
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },

      // 窗口菜单
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' },
          ...(isMac
            ? [
                { type: 'separator' as const },
                { role: 'front' as const },
                { type: 'separator' as const },
                { role: 'window' as const },
              ]
            : [{ role: 'close' as const }]),
        ],
      },

      // 帮助菜单
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click: async () => {
              await shell.openExternal('https://electronjs.org');
            },
          },
          ...(!isMac
            ? [
                { type: 'separator' as const },
                {
                  label: 'About Smart Toolbox',
                  click: () => this.windowManager.createAboutWindow(),
                },
              ]
            : []),
        ],
      },
    ];

    return template;
  }
}
