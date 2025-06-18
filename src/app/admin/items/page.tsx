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
import { PlusCircle, Edit3, Trash2, PackageSearch } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DeleteItemButton } from '@/components/admin/DeleteItemButton'; // New component

export default async function AdminItemsPage() {
  const items: Item[] = await getItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Manage Items</h1>
          <p className="text-muted-foreground">View, edit, or add new game items.</p>
        </div>
        <Button asChild>
          <Link href="/admin/items/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Listings</CardTitle>
          <CardDescription>A list of all items currently in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="w-[150px] text-center">Actions</TableHead>
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
                        className="rounded-md object-cover aspect-square"
                        data-ai-hint="item thumbnail"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell className="text-right">{item.price.toLocaleString()} Gold</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="outline" size="icon" asChild title="Edit Item">
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
            <div className="text-center py-12">
              <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No items found.</p>
              <p className="text-sm text-muted-foreground">Get started by adding a new item.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/items/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
