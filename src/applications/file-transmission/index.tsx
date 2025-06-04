import { useState } from 'react';
import { Sidebar } from './components/sidebar';
import { DeviceInfo } from './components/device-info';
import { ReceiveFiles } from './components/receive-files';
import { SendFiles } from './components/send-files';

type ViewMode = 'default' | 'receive' | 'send';

export function FileTransmission() {
  const [currentView, setCurrentView] = useState<ViewMode>('default');

  const renderMainContent = () => {
    switch (currentView) {
      case 'receive':
        return <ReceiveFiles />;
      case 'send':
        return <SendFiles />;
      default:
        return (
          <div className='flex-1 p-6 bg-background'>
            <div className='h-full flex items-center justify-center text-muted-foreground'>
              <div className='text-center space-y-4'>
                <h2 className='text-2xl font-semibold text-foreground'>
                  欢迎使用文件传输
                </h2>
                <p>选择左侧功能开始文件传输</p>
                <div className='text-sm space-y-2'>
                  <p>• 点击"接收文件"等待其他设备发送文件</p>
                  <p>• 点击"发送文件"向其他设备发送文件</p>
                  <p>• 确保设备在同一网络环境下</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className='w-full h-screen flex flex-col'>
      {/* 顶部设备信息栏 */}
      <DeviceInfo />

      {/* 主要内容区域 */}
      <div className='flex flex-1'>
        {/* 左侧功能区 */}
        <Sidebar onViewChange={setCurrentView} currentView={currentView} />

        {/* 右侧主要内容区 */}
        <div className='w-full'>{renderMainContent()}</div>
      </div>
    </div>
  );
}
