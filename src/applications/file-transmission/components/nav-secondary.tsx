import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, PageView } from '../types';

interface NavSecondaryProps {
  items: NavItem[];
  onItemClick: (url: PageView) => void;
}

export function NavSecondary({ items, onItemClick }: NavSecondaryProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                onClick={() => onItemClick(item.url)}
                className='cursor-pointer'
              >
                <span className='flex flex-row items-center gap-2'>
                  <item.icon />
                  <span>{item.title}</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
