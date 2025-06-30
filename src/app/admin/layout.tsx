import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarInset, SidebarTrigger, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Authentication is handled by middleware.ts for /admin/* routes.
  // If middleware allows access, it means the user is authenticated.

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur md:hidden">
            {/* Mobile Sidebar Trigger - using ShadCN's example */}
            <SidebarTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
