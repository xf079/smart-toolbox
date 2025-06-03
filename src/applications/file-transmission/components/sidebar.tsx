import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SettingsDialog } from './settings-dialog';
import { TransferHistory } from './transfer-history';
import { 
  Download, 
  Upload, 
  Settings, 
  History, 
  Users,
  FolderOpen,
} from 'lucide-react';

type ViewMode = 'default' | 'receive' | 'send';

interface SidebarProps {
  onViewChange: (view: ViewMode) => void;
  currentView: ViewMode;
}

export function Sidebar({ onViewChange, currentView }: SidebarProps) {
  return (
    <div className='w-80 h-full bg-muted/30 border-r flex flex-col p-4'>
      {/* 主要功能区 */}
      <div className='space-y-4'>
        <Card className='p-4'>
          <h3 className='font-semibold mb-3 text-sm text-muted-foreground'>
            文件传输
          </h3>
          <div className='space-y-2'>
            <Button 
              className='w-full justify-start h-12' 
              variant={currentView === 'receive' ? 'default' : 'outline'}
              onClick={() => onViewChange('receive')}
            >
              <Download className='mr-3 h-5 w-5' />
              接收文件
            </Button>
            <Button 
              className='w-full justify-start h-12' 
              variant={currentView === 'send' ? 'default' : 'outline'}
              onClick={() => onViewChange('send')}
            >
              <Upload className='mr-3 h-5 w-5' />
              发送文件
            </Button>
          </div>
        </Card>

        <Card className='p-4'>
          <h3 className='font-semibold mb-3 text-sm text-muted-foreground'>
            设备发现
          </h3>
          <div className='space-y-2'>
            <Button 
              className='w-full justify-start h-10' 
              variant='ghost'
            >
              <Users className='mr-3 h-4 w-4' />
              附近设备 (0)
            </Button>
            <div className='text-xs text-muted-foreground px-3 py-2'>
              正在搜索附近的设备...
            </div>
          </div>
        </Card>
      </div>

      <Separator className='my-4' />

      {/* 底部功能区 */}
      <div className='mt-auto space-y-2'>
        <TransferHistory>
          <Button 
            className='w-full justify-start' 
            variant='ghost'
            size='sm'
          >
            <History className='mr-3 h-4 w-4' />
            传输历史
          </Button>
        </TransferHistory>
        
        <Button 
          className='w-full justify-start' 
          variant='ghost'
          size='sm'
        >
          <FolderOpen className='mr-3 h-4 w-4' />
          下载文件夹
        </Button>
        
        <SettingsDialog>
          <Button 
            className='w-full justify-start' 
            variant='ghost'
            size='sm'
          >
            <Settings className='mr-3 h-4 w-4' />
            设置
          </Button>
        </SettingsDialog>
      </div>
    </div>
  );
}
