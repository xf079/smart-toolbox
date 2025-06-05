import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  History,
  Search,
  Download,
  Upload,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Clock,
  User,
  Trash2,
  BarChart3,
} from 'lucide-react';

interface TransferRecord {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  direction: 'sent' | 'received';
  status: 'completed' | 'failed' | 'cancelled';
  timestamp: number;
  deviceName: string;
  deviceIp: string;
  duration: number; // 传输耗时（秒）
  speed: number; // 传输速度（bytes/s）
}

export function TransferHistory() {
  const [records, setRecords] = useState<TransferRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<TransferRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    // 从本地存储加载传输历史
    const savedHistory = localStorage.getItem('transfer-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setRecords(parsed);
      } catch (error) {
        console.error('加载传输历史失败:', error);
      }
    } else {
      // 添加一些示例数据
      const sampleData: TransferRecord[] = [
        {
          id: '1',
          fileName: '项目文档.pdf',
          fileSize: 2048000,
          fileType: 'application/pdf',
          direction: 'received',
          status: 'completed',
          timestamp: Date.now() - 3600000,
          deviceName: 'iPhone',
          deviceIp: '192.168.1.101',
          duration: 15,
          speed: 136533,
        },
        {
          id: '2',
          fileName: '照片集.zip',
          fileSize: 15728640,
          fileType: 'application/zip',
          direction: 'sent',
          status: 'completed',
          timestamp: Date.now() - 7200000,
          deviceName: 'MacBook Pro',
          deviceIp: '192.168.1.102',
          duration: 45,
          speed: 349525,
        },
        {
          id: '3',
          fileName: '视频.mp4',
          fileSize: 52428800,
          fileType: 'video/mp4',
          direction: 'received',
          status: 'failed',
          timestamp: Date.now() - 86400000,
          deviceName: 'Windows PC',
          deviceIp: '192.168.1.103',
          duration: 0,
          speed: 0,
        },
      ];
      setRecords(sampleData);
      localStorage.setItem('transfer-history', JSON.stringify(sampleData));
    }
  }, []);

  useEffect(() => {
    // 应用过滤器
    let filtered = records;

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(
        record =>
          record.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.deviceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // 方向过滤
    if (directionFilter !== 'all') {
      filtered = filtered.filter(
        record => record.direction === directionFilter
      );
    }

    // 日期过滤
    if (dateFilter !== 'all') {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(record => now - record.timestamp < dayMs);
          break;
        case 'week':
          filtered = filtered.filter(
            record => now - record.timestamp < 7 * dayMs
          );
          break;
        case 'month':
          filtered = filtered.filter(
            record => now - record.timestamp < 30 * dayMs
          );
          break;
      }
    }

    // 按时间排序（最新的在前）
    filtered.sort((a, b) => b.timestamp - a.timestamp);
    setFilteredRecords(filtered);
  }, [records, searchQuery, statusFilter, directionFilter, dateFilter]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className='h-4 w-4' />;
    if (type.startsWith('video/')) return <Video className='h-4 w-4' />;
    if (type.startsWith('audio/')) return <Music className='h-4 w-4' />;
    if (type.includes('zip') || type.includes('rar'))
      return <Archive className='h-4 w-4' />;
    return <FileText className='h-4 w-4' />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatFileSize(bytesPerSecond) + '/s';
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - timestamp;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}小时前`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  const getStatusBadge = (status: TransferRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant='outline' className='text-green-600 border-green-600'>
            已完成
          </Badge>
        );
      case 'failed':
        return <Badge variant='destructive'>失败</Badge>;
      case 'cancelled':
        return <Badge variant='secondary'>已取消</Badge>;
    }
  };

  const getDirectionIcon = (direction: TransferRecord['direction']) => {
    return direction === 'sent' ? (
      <Upload className='h-4 w-4 text-blue-500' />
    ) : (
      <Download className='h-4 w-4 text-green-500' />
    );
  };

  const clearHistory = () => {
    setRecords([]);
    localStorage.removeItem('transfer-history');
  };

  const getStatistics = () => {
    const completed = records.filter(r => r.status === 'completed');
    const totalFiles = completed.length;
    const totalSize = completed.reduce((sum, r) => sum + r.fileSize, 0);
    const sentFiles = completed.filter(r => r.direction === 'sent').length;
    const receivedFiles = completed.filter(
      r => r.direction === 'received'
    ).length;

    return { totalFiles, totalSize, sentFiles, receivedFiles };
  };

  const stats = getStatistics();

  return (
    <div>
      {/* 统计信息 */}
      <div className='grid grid-cols-4 gap-4 mb-4'>
        <Card className='p-3'>
          <div className='flex items-center space-x-2'>
            <BarChart3 className='h-4 w-4 text-blue-500' />
            <div>
              <p className='text-sm text-muted-foreground'>总文件数</p>
              <p className='text-lg font-semibold'>{stats.totalFiles}</p>
            </div>
          </div>
        </Card>
        <Card className='p-3'>
          <div className='flex items-center space-x-2'>
            <Download className='h-4 w-4 text-green-500' />
            <div>
              <p className='text-sm text-muted-foreground'>已接收</p>
              <p className='text-lg font-semibold'>{stats.receivedFiles}</p>
            </div>
          </div>
        </Card>
        <Card className='p-3'>
          <div className='flex items-center space-x-2'>
            <Upload className='h-4 w-4 text-blue-500' />
            <div>
              <p className='text-sm text-muted-foreground'>已发送</p>
              <p className='text-lg font-semibold'>{stats.sentFiles}</p>
            </div>
          </div>
        </Card>
        <Card className='p-3'>
          <div className='flex items-center space-x-2'>
            <Archive className='h-4 w-4 text-purple-500' />
            <div>
              <p className='text-sm text-muted-foreground'>总大小</p>
              <p className='text-lg font-semibold'>
                {formatFileSize(stats.totalSize)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 过滤器 */}
      <div className='flex space-x-2 mb-4'>
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='搜索文件名或设备名...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>所有状态</SelectItem>
            <SelectItem value='completed'>已完成</SelectItem>
            <SelectItem value='failed'>失败</SelectItem>
            <SelectItem value='cancelled'>已取消</SelectItem>
          </SelectContent>
        </Select>
        <Select value={directionFilter} onValueChange={setDirectionFilter}>
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>所有方向</SelectItem>
            <SelectItem value='sent'>已发送</SelectItem>
            <SelectItem value='received'>已接收</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>所有时间</SelectItem>
            <SelectItem value='today'>今天</SelectItem>
            <SelectItem value='week'>本周</SelectItem>
            <SelectItem value='month'>本月</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 传输记录列表 */}
      <ScrollArea className='flex-1'>
        <div className='space-y-2'>
          {filteredRecords.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <History className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>暂无传输记录</p>
            </div>
          ) : (
            filteredRecords.map(record => (
              <Card key={record.id} className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3 flex-1'>
                    <div className='flex items-center space-x-2'>
                      {getDirectionIcon(record.direction)}
                      {getFileIcon(record.fileType)}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center space-x-2 mb-1'>
                        <p className='font-medium truncate'>
                          {record.fileName}
                        </p>
                        {getStatusBadge(record.status)}
                      </div>
                      <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                        <span className='flex items-center space-x-1'>
                          <User className='h-3 w-3' />
                          <span>{record.deviceName}</span>
                        </span>
                        <span>{formatFileSize(record.fileSize)}</span>
                        {record.status === 'completed' && (
                          <>
                            <span>{formatSpeed(record.speed)}</span>
                            <span>{formatDuration(record.duration)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='text-right text-sm text-muted-foreground'>
                    <div className='flex items-center space-x-1'>
                      <Clock className='h-3 w-3' />
                      <span>{formatTime(record.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* 操作按钮 */}
      <div className='flex justify-between'>
        <Button variant='outline' onClick={clearHistory}>
          <Trash2 className='h-4 w-4 mr-2' />
          清空历史
        </Button>
      </div>
    </div>
  );
}
