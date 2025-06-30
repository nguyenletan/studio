import { ItemForm } from '@/components/admin/ItemForm';
import { updateItemAction, deleteItemAction } from '@/lib/actions';
import { getItemById } from '@/lib/data';
import type { Item } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const item: Item | null | undefined = await getItemById(params.id);
  const t = await getTranslations();

  if (!item) {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold">{t('adminEditItem.itemNotFound')}</h1>
        <p className="text-muted-foreground">{t('adminEditItem.itemNotFoundDescription')}</p>
        <Button variant="outline" asChild>
          <Link href="/admin/items">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('adminEditItem.backToItems')}
          </Link>
        </Button>
      </div>
    );
  }

  // Bind the item ID to the update action
  const updateItemActionWithId = updateItemAction.bind(null, params.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">
            {t('adminEditItem.editItemTitle', { name: item?.name })}
          </h1>
          <p className="text-muted-foreground">{t('adminEditItem.editItemDescription')}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/items">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('adminEditItem.backToItems')}
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('adminEditItem.editItemDetailsTitle')}</CardTitle>
          <CardDescription>
            {t('adminEditItem.editItemDetailsDescription', { name: item?.name })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemForm
            item={item}
            formAction={updateItemActionWithId}
            deleteAction={deleteItemAction}
            isEditMode={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
