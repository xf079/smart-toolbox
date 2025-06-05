import type { LucideIcon } from 'lucide-react';

export type PageView = 'default' | 'receive' | 'send' | 'history' | 'settings';

export type NavItem = {
  title: string;
  url: PageView;
  icon: LucideIcon;
};
