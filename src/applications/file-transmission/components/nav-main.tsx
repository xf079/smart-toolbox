import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, PageView } from '../types';

interface NavMainProps {
  items: NavItem[];
  onItemClick: (url: PageView) => void;
}

export function NavMain({ items, onItemClick }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>文件传输</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className='cursor-pointer'
              onClick={() => onItemClick(item.url)}
            >
              <div className='flex flex-row items-center gap-2'>
                <item.icon className='size-8' />
                <span className='text-sm'>{item.title}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
