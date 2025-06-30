'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { adminLogout } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Gamepad2,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LanguageSelector } from '@/components/shared/LanguageSelector'; // Assuming sidebar is a ShadCN component or custom

const navItems = [
  { href: '/admin', label: 'dashboard', icon: LayoutDashboard },
  { href: '/admin/items', label: 'manageItems', icon: Package },
  // { href: '/admin/users', label: 'manageUsers', icon: Users },
  // { href: '/admin/settings', label: 'settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();

  const handleLogout = async () => {
    await adminLogout();
    toast({
      title: t('adminSidebar.logoutTitle'),
      description: t('adminSidebar.logoutDescription'),
    });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link
          href="/"
          className="flex items-center space-x-2 group-data-[collapsible=icon]:justify-center"
        >
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold group-data-[collapsible=icon]:hidden">
            {t('adminSidebar.title')}
          </span>
          <LanguageSelector />
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                }
                tooltip={{ children: t(`adminSidebar.${item.label}`), side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t(`adminSidebar.${item.label}`)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/admin/items/new'}
              tooltip={{ children: t('adminSidebar.addNewItem'), side: 'right' }}
            >
              <Link href="/admin/items/new">
                <PlusCircle />
                <span>{t('adminSidebar.addNewItem')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={{ children: t('adminSidebar.logout'), side: 'right' }}
            >
              <LogOut />
              <span>{t('adminSidebar.logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
