import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FolderOpen,
  Wifi,
  Shield,
  Palette,
  Download,
  Trash2,
  RefreshCw,
  RefreshCcw,
  Stethoscope,
} from 'lucide-react';

interface AppSettings {
  downloadPath: string;
  autoAcceptFiles: boolean;
  showNotifications: boolean;
  port: string;
  maxFileSize: string;
  theme: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  enableEncryption: boolean;
  autoStartServer: boolean;
  compressionLevel: string;
}

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    downloadPath: '~/Downloads',
    autoAcceptFiles: false,
    showNotifications: true,
    port: '53317',
    maxFileSize: '1024',
    theme: 'system',
    language: 'zh',
    enableEncryption: true,
    autoStartServer: true,
    compressionLevel: 'medium',
  });

  useEffect(() => {
    // 从本地存储加载设置
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    }
  }, []);

  const saveSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    const defaultSettings: AppSettings = {
      downloadPath: '~/Downloads',
      autoAcceptFiles: false,
      showNotifications: true,
      port: '53317',
      maxFileSize: '1024',
      theme: 'system',
      language: 'zh',
      enableEncryption: true,
      autoStartServer: true,
      compressionLevel: 'medium',
    };
    setSettings(defaultSettings);
    localStorage.setItem('app-settings', JSON.stringify(defaultSettings));
  };

  const selectDownloadPath = () => {
    // 在实际应用中，这里会调用Electron的文件夹选择对话框
    console.log('选择下载文件夹');
  };

  const clearCache = () => {
    // 清除应用缓存
    localStorage.removeItem('transfer-history');
    console.log('缓存已清除');
  };
  return (
    <div className='p-4'>
      <div className='mb-4 gap-4'>
        <h1 className='text-xl font-bold'>设置</h1>
        <p className='text-sm text-muted-foreground'>
          配置文件传输和应用行为设置
        </p>
      </div>

      <div className='space-y-6'>
        {/* 文件传输设置 */}
        <Card className='p-4 gap-2'>
          <div className='flex items-center space-x-2 mb-4'>
            <Download className='h-4 w-4' />
            <h3 className='font-semibold'>文件传输</h3>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2 flex flex-row items-center justify-between'>
              <Label htmlFor='download-path'>下载文件夹</Label>
              <div className='flex space-x-0.5'>
                <Input
                  id='download-path'
                  value={settings.downloadPath}
                  onChange={e => saveSettings({ downloadPath: e.target.value })}
                  className='flex-1'
                />
                <Button variant='outline' onClick={selectDownloadPath}>
                  <FolderOpen className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='space-y-2 flex flex-row items-center justify-between'>
              <Label htmlFor='max-file-size'>最大文件大小 (MB)</Label>
              <Input
                className='flex-1 max-w-24'
                id='max-file-size'
                type='number'
                value={settings.maxFileSize}
                onChange={e => saveSettings({ maxFileSize: e.target.value })}
              />
            </div>

            <div className='space-y-2 flex flex-row items-center justify-between'>
              <Label htmlFor='compression'>压缩级别</Label>
              <Select
                value={settings.compressionLevel}
                onValueChange={value =>
                  saveSettings({ compressionLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>无压缩</SelectItem>
                  <SelectItem value='low'>低压缩</SelectItem>
                  <SelectItem value='medium'>中等压缩</SelectItem>
                  <SelectItem value='high'>高压缩</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>自动接受文件</Label>
                <p className='text-sm text-muted-foreground'>
                  自动接受来自信任设备的文件
                </p>
              </div>
              <Switch
                checked={settings.autoAcceptFiles}
                onCheckedChange={checked =>
                  saveSettings({ autoAcceptFiles: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* 网络设置 */}
        <Card className='p-4 gap-2'>
          <div className='flex items-center space-x-2 mb-4'>
            <Wifi className='h-4 w-4' />
            <h3 className='font-semibold'>网络设置</h3>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2 flex flex-row items-center justify-between'>
              <Label htmlFor='port'>服务器</Label>
              <div className='flex space-x-0.5'>
                <Button variant='outline'>
                  <RefreshCcw className='h-4 w-4' />
                </Button>
                <Button variant='outline'>
                  <Stethoscope className='h-4 w-4' />
                </Button>
              </div>
            </div>
            <div className='space-y-2 flex flex-row items-center justify-between'>
              <Label htmlFor='port'>监听端口</Label>
              <Input
                className='flex-1 max-w-24'
                id='port'
                type='number'
                value={settings.port}
                onChange={e => saveSettings({ port: e.target.value })}
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>自动启动服务器</Label>
                <p className='text-sm text-muted-foreground'>
                  应用启动时自动开启文件传输服务
                </p>
              </div>
              <Switch
                checked={settings.autoStartServer}
                onCheckedChange={checked =>
                  saveSettings({ autoStartServer: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* 安全设置 */}
        <Card className='p-4 gap-2'>
          <div className='flex items-center space-x-2 mb-4'>
            <Shield className='h-4 w-4' />
            <h3 className='font-semibold'>安全设置</h3>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>启用加密传输</Label>
                <p className='text-sm text-muted-foreground'>
                  使用端到端加密保护文件传输
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <Switch
                  checked={settings.enableEncryption}
                  onCheckedChange={checked =>
                    saveSettings({ enableEncryption: checked })
                  }
                />
                <Badge variant='secondary' className='text-xs'>
                  推荐
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* 界面设置 */}
        <Card className='p-4 gap-2'>
          <div className='flex items-center space-x-2 mb-4'>
            <Palette className='h-4 w-4' />
            <h3 className='font-semibold'>界面设置</h3>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2 flex flex-row items-center justify-between'>
              <Label htmlFor='theme'>主题</Label>
              <Select
                value={settings.theme}
                onValueChange={value =>
                  saveSettings({
                    theme: value as 'light' | 'dark' | 'system',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='light'>浅色</SelectItem>
                  <SelectItem value='dark'>深色</SelectItem>
                  <SelectItem value='system'>跟随系统</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2 flex flex-row items-center justify-between'>
              <Label htmlFor='language'>语言</Label>
              <Select
                value={settings.language}
                onValueChange={value =>
                  saveSettings({ language: value as 'zh' | 'en' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='zh'>中文</SelectItem>
                  <SelectItem value='en'>English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>显示通知</Label>
                <p className='text-sm text-muted-foreground'>
                  文件传输完成时显示系统通知
                </p>
              </div>
              <Switch
                checked={settings.showNotifications}
                onCheckedChange={checked =>
                  saveSettings({ showNotifications: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* 操作按钮 */}
        <div className='flex justify-end'>
          <div className='space-x-2'>
            <Button variant='outline' onClick={clearCache}>
              <Trash2 className='h-4 w-4 mr-2' />
              清除缓存
            </Button>
            <Button variant='default' onClick={resetSettings}>
              <RefreshCw className='h-4 w-4 mr-2' />
              重置设置
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
