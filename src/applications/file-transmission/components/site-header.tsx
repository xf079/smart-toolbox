import { SidebarIcon,MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className='flex w-full items-center py-4'>
      <div className='flex flex-row justify-between w-full items-center gap-2 px-2.5'>
        <div className='flex flex-row items-center gap-2'>
          <Button
            className='h-8 w-8'
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
          >
            <MenuIcon className='size-4' />
          </Button>
          <h1 className='text-sm font-bold'>局域网文件传输</h1>
        </div>
      </div>
    </header>
  );
}
