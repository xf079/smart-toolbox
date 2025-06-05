import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  X,
  Send,
  Smartphone,
  Monitor,
  Laptop,
  Plus,
} from 'lucide-react';

interface SelectedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface Device {
  id: string;
  name: string;
  ip: string;
  type: 'phone' | 'computer' | 'tablet';
  online: boolean;
}

export function SendFiles() {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [devices] = useState<Device[]>([
    {
      id: '1',
      name: 'iPhone',
      ip: '192.168.1.101',
      type: 'phone',
      online: true,
    },
    {
      id: '2',
      name: 'MacBook Pro',
      ip: '192.168.1.102',
      type: 'computer',
      online: true,
    },
    {
      id: '3',
      name: 'Windows PC',
      ip: '192.168.1.103',
      type: 'computer',
      online: false,
    },
  ]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: SelectedFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className='h-5 w-5' />;
    if (type.startsWith('video/')) return <Video className='h-5 w-5' />;
    if (type.startsWith('audio/')) return <Music className='h-5 w-5' />;
    if (type.includes('zip') || type.includes('rar'))
      return <Archive className='h-5 w-5' />;
    return <FileText className='h-5 w-5' />;
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className='h-5 w-5' />;
      case 'computer':
        return <Monitor className='h-5 w-5' />;
      case 'tablet':
        return <Laptop className='h-5 w-5' />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  const handleSend = () => {
    if (selectedFiles.length === 0 || !selectedDevice) return;
    // 这里实现发送逻辑
    console.log('发送文件到设备:', selectedDevice, selectedFiles);
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>发送文件</h2>
          <p className='text-muted-foreground'>选择文件并发送到其他设备</p>
        </div>
        <div className='flex items-center space-x-2'>
          <Upload className='h-5 w-5 text-primary' />
          <span className='text-sm font-medium'>发送模式</span>
        </div>
      </div>

      {/* 文件选择区域 */}
      <Card className='border-2 border-dashed border-muted-foreground/25 p-8'>
        <div className='text-center space-y-4'>
          <div className='mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
            <Plus className='h-8 w-8 text-primary' />
          </div>
          <div>
            <h3 className='text-lg font-semibold'>选择要发送的文件</h3>
            <p className='text-muted-foreground'>
              点击选择文件或拖拽文件到此区域
            </p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()}>
            选择文件
          </Button>
          <Input
            ref={fileInputRef}
            type='file'
            multiple
            className='hidden'
            onChange={handleFileSelect}
          />
        </div>
      </Card>

      {/* 已选择的文件 */}
      {selectedFiles.length > 0 && (
        <Card className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold'>
              已选择文件 ({selectedFiles.length})
            </h3>
            <div className='text-sm text-muted-foreground'>
              总大小: {formatFileSize(getTotalSize())}
            </div>
          </div>
          <div className='space-y-2 max-h-60 overflow-y-auto'>
            {selectedFiles.map(file => (
              <div
                key={file.id}
                className='flex items-center justify-between p-2 bg-muted/50 rounded'
              >
                <div className='flex items-center space-x-3'>
                  <div className='text-muted-foreground'>
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <p className='font-medium text-sm'>{file.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => removeFile(file.id)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 设备选择 */}
      <Card className='p-4'>
        <h3 className='text-lg font-semibold mb-4'>选择目标设备</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {devices.map(device => (
            <div
              key={device.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedDevice === device.id
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground/50'
              } ${!device.online ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => device.online && setSelectedDevice(device.id)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='text-muted-foreground'>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <p className='font-medium text-sm'>{device.name}</p>
                    <p className='text-xs text-muted-foreground'>{device.ip}</p>
                  </div>
                </div>
                <Badge variant={device.online ? 'default' : 'secondary'}>
                  {device.online ? '在线' : '离线'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 发送按钮 */}
      <div className='flex justify-end'>
        <Button
          onClick={handleSend}
          disabled={selectedFiles.length === 0 || !selectedDevice}
          className='px-8'
        >
          <Send className='mr-2 h-4 w-4' />
          发送文件
        </Button>
      </div>
    </div>
  );
}
