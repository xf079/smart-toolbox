import { use } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { History, Send, Settings2, SquareTerminal } from 'lucide-react';

import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { FileTransmissionContext } from '../context';
import type { NavItem, PageView } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mainItems: NavItem[] = [
  {
    title: '接受文件',
    url: 'receive',
    icon: SquareTerminal,
  },
  {
    title: '发送文件',
    url: 'send',
    icon: Send,
  },
];

const secondaryItems: NavItem[] = [
  {
    title: '传输历史',
    url: 'history',
    icon: History,
  },
  {
    title: '设置',
    url: 'settings',
    icon: Settings2,
  },
];

export function AppSidebar() {
  const { setPageView } = use(FileTransmissionContext);

  const onItemClick = (url: PageView) => {
    setPageView(url);
  };

  return (
    <Sidebar variant='inset' className='h-full'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <div className='flex items-center gap-2'>
                <Avatar className='rounded-lg'>
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>会飞的鱼</span>
                  <span className='truncate text-xs'>192.168.1.100</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainItems} onItemClick={onItemClick} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={secondaryItems} onItemClick={onItemClick} />
      </SidebarFooter>
    </Sidebar>
  );
}
