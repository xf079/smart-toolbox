import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wifi, Copy, Check, Edit2, User } from 'lucide-react';

export function DeviceInfo() {
  const [deviceName, setDeviceName] = useState('我的设备');
  const [nickname, setNickname] = useState('用户');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [port] = useState('53317');
  const [copied, setCopied] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState('');

  useEffect(() => {
    // 获取设备名称
    const hostname = window.navigator.userAgent.includes('Windows')
      ? 'Windows设备'
      : window.navigator.userAgent.includes('Mac')
        ? 'Mac设备'
        : '设备';
    setDeviceName(hostname);

    // 模拟获取IP地址 - 在实际应用中需要通过Electron主进程获取
    setIpAddress('192.168.1.100');

    // 从本地存储获取用户设置
    const savedNickname = localStorage.getItem('user-nickname');
    const savedAvatar = localStorage.getItem('user-avatar');
    if (savedNickname) setNickname(savedNickname);
    if (savedAvatar) setAvatarUrl(savedAvatar);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleNicknameEdit = () => {
    setTempNickname(nickname);
    setIsEditingNickname(true);
  };

  const handleNicknameSave = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname.trim());
      localStorage.setItem('user-nickname', tempNickname.trim());
    }
    setIsEditingNickname(false);
  };

  const handleNicknameCancel = () => {
    setTempNickname('');
    setIsEditingNickname(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
        localStorage.setItem('user-avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className='m-4 p-4 border-b'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {/* 用户头像和昵称 */}
          <div className='flex items-center space-x-3'>
            <div className='relative group'>
              <Avatar className='h-10 w-10 cursor-pointer'>
                <AvatarImage src={avatarUrl} alt={nickname} />
                <AvatarFallback className='bg-primary/10 text-primary'>
                  {avatarUrl ? (
                    <User className='h-5 w-5' />
                  ) : (
                    getInitials(nickname)
                  )}
                </AvatarFallback>
              </Avatar>
              <input
                type='file'
                accept='image/*'
                onChange={handleAvatarChange}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                title='点击更换头像'
              />
            </div>

            <div className='flex flex-col'>
              {isEditingNickname ? (
                <div className='flex items-center space-x-2'>
                  <Input
                    value={tempNickname}
                    onChange={e => setTempNickname(e.target.value)}
                    className='h-6 text-sm w-24'
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleNicknameSave();
                      if (e.key === 'Escape') handleNicknameCancel();
                    }}
                    autoFocus
                  />
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 w-6 p-0'
                    onClick={handleNicknameSave}
                  >
                    <Check className='h-3 w-3' />
                  </Button>
                </div>
              ) : (
                <div className='flex items-center space-x-2 group'>
                  <span className='font-medium text-sm'>{nickname}</span>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={handleNicknameEdit}
                  >
                    <Edit2 className='h-3 w-3' />
                  </Button>
                </div>
              )}
              <span className='text-xs text-muted-foreground'>
                {deviceName}
              </span>
            </div>
          </div>

          {/* 在线状态 */}
          <div className='flex items-center space-x-2'>
            <Wifi className='h-4 w-4 text-green-500' />
            <Badge variant='secondary' className='text-sm'>
              在线
            </Badge>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          {/* IP地址信息 */}
          <div className='text-sm text-muted-foreground'>
            <span>IP地址: </span>
            <span className='font-mono font-medium'>
              {ipAddress}:{port}
            </span>
            <Button
              variant='ghost'
              size='sm'
              className='ml-2 h-6 w-6 p-0'
              onClick={() => copyToClipboard(`${ipAddress}:${port}`)}
            >
              {copied ? (
                <Check className='h-3 w-3 text-green-500' />
              ) : (
                <Copy className='h-3 w-3' />
              )}
            </Button>
          </div>

          <Badge variant='outline' className='text-xs'>
            LocalSend兼容
          </Badge>
        </div>
      </div>
    </Card>
  );
} 