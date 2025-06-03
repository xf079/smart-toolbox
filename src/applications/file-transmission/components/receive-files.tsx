import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Image, 
  Video, 
  Music,
  Archive,
  X,
  Check
} from 'lucide-react';

interface FileTransfer {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'waiting' | 'transferring' | 'completed' | 'failed';
  sender: string;
}

export function ReceiveFiles() {
  const [transfers, setTransfers] = useState<FileTransfer[]>([
    {
      id: '1',
      name: '示例文档.pdf',
      size: 2048000,
      type: 'application/pdf',
      progress: 65,
      status: 'transferring',
      sender: 'iPhone (192.168.1.101)'
    },
    {
      id: '2',
      name: '照片.jpg',
      size: 1024000,
      type: 'image/jpeg',
      progress: 100,
      status: 'completed',
      sender: 'MacBook (192.168.1.102)'
    }
  ]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className='h-5 w-5' />;
    if (type.startsWith('video/')) return <Video className='h-5 w-5' />;
    if (type.startsWith('audio/')) return <Music className='h-5 w-5' />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className='h-5 w-5' />;
    return <FileText className='h-5 w-5' />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: FileTransfer['status']) => {
    switch (status) {
      case 'waiting':
        return <Badge variant='secondary'>等待中</Badge>;
      case 'transferring':
        return <Badge variant='default'>传输中</Badge>;
      case 'completed':
        return <Badge variant='outline' className='text-green-600 border-green-600'>已完成</Badge>;
      case 'failed':
        return <Badge variant='destructive'>失败</Badge>;
    }
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>接收文件</h2>
          <p className='text-muted-foreground'>等待其他设备发送文件</p>
        </div>
        <div className='flex items-center space-x-2'>
          <Download className='h-5 w-5 text-primary' />
          <span className='text-sm font-medium'>接收模式已开启</span>
        </div>
      </div>

      {/* 拖拽接收区域 */}
      <Card className='border-2 border-dashed border-muted-foreground/25 p-8'>
        <div className='text-center space-y-4'>
          <div className='mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
            <Download className='h-8 w-8 text-primary' />
          </div>
          <div>
            <h3 className='text-lg font-semibold'>准备接收文件</h3>
            <p className='text-muted-foreground'>
              其他设备可以向此设备发送文件
            </p>
          </div>
          <div className='text-sm text-muted-foreground'>
            <p>确保设备在同一网络下</p>
            <p>IP地址: 192.168.1.100:53317</p>
          </div>
        </div>
      </Card>

      {/* 传输列表 */}
      {transfers.length > 0 && (
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>传输记录</h3>
          {transfers.map((transfer) => (
            <Card key={transfer.id} className='p-4'>
              <div className='flex items-center space-x-4'>
                <div className='text-muted-foreground'>
                  {getFileIcon(transfer.type)}
                </div>
                
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-2'>
                    <div>
                      <p className='font-medium truncate'>{transfer.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {formatFileSize(transfer.size)} • 来自 {transfer.sender}
                      </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {getStatusBadge(transfer.status)}
                      {transfer.status === 'completed' && (
                        <Button variant='ghost' size='sm'>
                          <Check className='h-4 w-4' />
                        </Button>
                      )}
                      <Button variant='ghost' size='sm'>
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  
                  {transfer.status === 'transferring' && (
                    <div className='space-y-1'>
                      <Progress value={transfer.progress} className='h-2' />
                      <p className='text-xs text-muted-foreground'>
                        {transfer.progress}% 完成
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 