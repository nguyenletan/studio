import { getSession } from '@/lib/auth';
import type { AdminUser } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, PlusCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AdminDashboardPage() {
  const session: AdminUser | null = await getSession();
  const t = await getTranslations();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            {t('adminDashboard.welcomePrefix')}{' '}
            {session?.username || t('adminDashboard.defaultAdmin')}
            {t('adminDashboard.welcomeSuffix')}
          </CardTitle>
          <CardDescription>{t('adminDashboard.manageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('adminDashboard.centralHub')}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('adminDashboard.manageItemsTitle')}
            </CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t('adminDashboard.itemListingsTitle')}</div>
            <p className="mb-4 text-xs text-muted-foreground">
              {t('adminDashboard.itemListingsDescription')}
            </p>
            <Button asChild size="sm">
              <Link href="/admin/items">{t('adminDashboard.goToItems')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('adminDashboard.addNewItemTitle')}
            </CardTitle>
            <PlusCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t('adminDashboard.createItemTitle')}</div>
            <p className="mb-4 text-xs text-muted-foreground">
              {t('adminDashboard.addItemDescription')}
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/items/new">{t('adminDashboard.addItem')}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for future features */}
        {/* <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('adminDashboard.userManagementTitle')}</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t('adminDashboard.comingSoonTitle')}</div>
            <p className="text-xs text-muted-foreground mb-4">
              {t('adminDashboard.userManagementDescription')}
            </p>
             <Button disabled size="sm" variant="secondary">
              {t('adminDashboard.viewUsers')}
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
