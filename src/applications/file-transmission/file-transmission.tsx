import { use } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from './components/site-header';
import { AppSidebar } from './components/app-sidebar';

import { FileTransmissionContext } from './context';

import { ReceiveFiles } from './pages/receive-files';
import { SendFiles } from './pages/send-files';
import { TransferHistory } from './pages/transfer-history';
import { Settings } from './pages/settings';

export function FileTransmissionContent() {
  const { pageView } = use(FileTransmissionContext);

  const renderMainContent = () => {
    switch (pageView) {
      case 'receive':
        return <ReceiveFiles />;
      case 'send':
        return <SendFiles />;
      case 'history':
        return <TransferHistory />;
      case 'settings':
        return <Settings />;
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
    <div className='font-semibold'>
      <SidebarProvider
        className='flex flex-row'
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 54)',
            '--header-height': 'calc(var(--spacing) * 4)',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <div className='flex-1 flex flex-col'>
          <SiteHeader />
          <SidebarInset>
            <div className='flex flex-1 flex-col'>
              <div className='@container/main flex flex-1 flex-col gap-2 px-5'>
                <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                  {renderMainContent()}
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
