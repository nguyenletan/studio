'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { adminLogout } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { LayoutDashboard, Package, PlusCircle, LogOut, Settings, Users, Gamepad2 } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar'; // Assuming sidebar is a ShadCN component or custom

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/items', label: 'Manage Items', icon: Package },
  // { href: '/admin/users', label: 'Manage Users', icon: Users },
  // { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await adminLogout();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="border-r" collapsible="icon">
        <SidebarHeader className="p-4">
           <Link href="/" className="flex items-center space-x-2 group-data-[collapsible=icon]:justify-center">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl font-bold group-data-[collapsible=icon]:hidden">ItemDrop Admin</span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                  tooltip={{children: item.label, side: 'right'}}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/admin/items/new'}
                  tooltip={{children: 'Add New Item', side: 'right'}}
                >
                  <Link href="/admin/items/new">
                    <PlusCircle />
                    <span>Add New Item</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2">
           <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{children: 'Logout', side: 'right'}}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
