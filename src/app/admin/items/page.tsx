import { getItems } from '@/lib/data';
import type { Item } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit3, PackageSearch } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DeleteItemButton } from '@/components/admin/DeleteItemButton'; // New component
import { getTranslations } from 'next-intl/server';

export default async function AdminItemsPage() {
  const items: Item[] = await getItems();
  const t = await getTranslations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{t('adminItems.pageTitle')}</h1>
          <p className="text-muted-foreground">{t('adminItems.pageDescription')}</p>
        </div>
        <Button asChild>
          <Link href="/admin/items/new">
            <PlusCircle className="mr-2 h-4 w-4" /> {t('adminItems.addNewItem')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('adminItems.itemListingsTitle')}</CardTitle>
          <CardDescription>{t('adminItems.itemListingsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">{t('adminItems.tableImage')}</TableHead>
                  <TableHead>{t('adminItems.tableName')}</TableHead>
                  <TableHead>{t('adminItems.tableCategory')}</TableHead>
                  <TableHead className="text-right">{t('adminItems.tablePrice')}</TableHead>
                  <TableHead className="w-[150px] text-center">
                    {t('adminItems.tableActions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="aspect-square rounded-md object-cover"
                        data-ai-hint={item.category.toLowerCase()}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    {/*<TableCell className="text-right">{item.price.toLocaleString()} {t('adminItems.currency')}</TableCell>*/}
                    <TableCell className="text-right">{item.price.toLocaleString()} VND</TableCell>
                    <TableCell className="space-x-2 text-center">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        title={t('adminItems.editItemTooltip')}
                      >
                        <Link href={`/admin/items/${item.id}/edit`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteItemButton itemId={item.id} itemName={item.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <PackageSearch className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-xl font-semibold">
                {t('adminItems.noItemsFound')}
              </p>
              <p className="text-muted-foreground text-sm">{t('adminItems.noItemsDescription')}</p>
              <Button asChild className="mt-4">
                <Link href="/admin/items/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> {t('adminItems.addNewItem')}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
