import { ItemForm } from '@/components/admin/ItemForm';
import { createItemAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function NewItemPage() {
  const t = await getTranslations();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{t('adminNewItem.pageTitle')}</h1>
          <p className="text-muted-foreground">{t('adminNewItem.pageDescription')}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/items">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('adminNewItem.backToItems')}
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('adminNewItem.detailsTitle')}</CardTitle>
          <CardDescription>{t('adminNewItem.detailsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemForm formAction={createItemAction} isEditMode={false} />
        </CardContent>
      </Card>
    </div>
  );
}
