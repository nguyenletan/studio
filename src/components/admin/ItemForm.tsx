'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Item } from '@/types';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Save, Trash2, Loader2 } from 'lucide-react';
import type { ItemFormState } from '@/lib/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const itemFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  longDescription: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).min(1, 'Image URL is required'),
  category: z.string().min(1, { message: 'Category is required.' }),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  item?: Item | null;
  formAction: (prevState: ItemFormState | undefined, formData: FormData) => Promise<ItemFormState>;
  deleteAction?: (id: string) => Promise<{ success: boolean; message?: string }>;
  isEditMode: boolean;
}

export function ItemForm({ item, formAction, deleteAction, isEditMode }: ItemFormProps) {
  const [formState, dispatchFormAction] = useFormState(formAction, undefined);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description,
          longDescription: item.longDescription || '',
          price: item.price,
          imageUrl: item.imageUrl,
          category: item.category,
        }
      : {
          name: '',
          description: '',
          longDescription: '',
          price: 0,
          imageUrl: '',
          category: '',
        },
  });

  useEffect(() => {
    if (formState?.message) {
      if (formState.success) {
        toast({
          title: isEditMode ? 'Update Successful' : 'Creation Successful',
          description: formState.message,
        });
        if (!isEditMode) { // Only reset and redirect on create
          form.reset(); // Reset form fields
        }
        router.push('/admin/items'); // Redirect to items list
      } else {
        toast({
          variant: 'destructive',
          title: isEditMode ? 'Update Failed' : 'Creation Failed',
          description: formState.message || 'An error occurred.',
        });
      }
    }
    if (formState?.errors) {
      // Set form errors manually if needed, or rely on zodResolver
      // For example, form.setError('name', { type: 'manual', message: formState.errors.name?.[0] })
    }
    setIsSubmitting(false); // Always reset submitting state
  }, [formState, toast, form, router, isEditMode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    await form.trigger(); // Trigger validation
    if (form.formState.isValid) {
      dispatchFormAction(formData);
    } else {
      setIsSubmitting(false); // Validation failed
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please correct the errors in the form.',
      });
    }
  };
  
  const handleDelete = async () => {
    if (!item || !item.id || !deleteAction) return;
    setIsDeleting(true);
    const result = await deleteAction(item.id);
    if (result.success) {
      toast({ title: 'Item Deleted', description: result.message });
      router.push('/admin/items');
    } else {
      toast({ variant: 'destructive', title: 'Deletion Failed', description: result.message });
    }
    setIsDeleting(false);
  };


  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Excalibur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A legendary sword of immense power." {...field} rows={3}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed lore and attributes of the item..." {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (Gold)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Weapon, Armor, Potion" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x400.png" {...field} />
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="mt-2">
                  <img src={field.value} alt="Preview" className="h-32 w-auto rounded-md object-cover border" />
                </div>
              )}
            </FormItem>
          )}
        />
        
        {formState?.errors?._form && (
          <FormMessage className="text-destructive-foreground bg-destructive p-3 rounded-md">
            {formState.errors._form.join(', ')}
          </FormMessage>
        )}

        <div className="flex justify-between items-center pt-4">
          <Button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Item')}
          </Button>
          {isEditMode && deleteAction && item && (
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isDeleting || isSubmitting}>
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  {isDeleting ? 'Deleting...' : 'Delete Item'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item
                    "{item.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </form>
    </Form>
  );
}
