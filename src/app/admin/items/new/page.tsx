import { ItemForm } from '@/components/admin/ItemForm';
import { createItemAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewItemPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Add New Item</h1>
          <p className="text-muted-foreground">Fill in the details for the new game item.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/items">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Items
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Item Details</CardTitle>
          <CardDescription>Provide all necessary information for the item.</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemForm formAction={createItemAction} isEditMode={false} />
        </CardContent>
      </Card>
    </div>
  );
}
