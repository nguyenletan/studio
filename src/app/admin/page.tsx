import { getSession } from '@/lib/auth';
import type { AdminUser } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, PlusCircle, Users } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session: AdminUser | null = await getSession();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Welcome, {session?.username || 'Admin'}!
          </CardTitle>
          <CardDescription>
            Manage your game item listings and site settings from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This is your central hub for managing ItemDrop. Use the navigation oscuro to explore
            different sections.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Items</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Item Listings</div>
            <p className="mb-4 text-xs text-muted-foreground">
              View, edit, or delete existing items.
            </p>
            <Button asChild size="sm">
              <Link href="/admin/items">Go to Items</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Add New Item</CardTitle>
            <PlusCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Create Item</div>
            <p className="mb-4 text-xs text-muted-foreground">
              Add a new game item to your catalog.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/items/new">Add Item</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for future features */}
        {/* <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Management</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground mb-4">
              Manage user accounts and roles.
            </p>
             <Button disabled size="sm" variant="secondary">
              View Users
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
