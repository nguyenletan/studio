
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
import { Save, Trash2, Loader2, Images } from 'lucide-react';
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
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
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
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(item?.imageUrl);


  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description,
          longDescription: item.longDescription || '',
          price: item.price,
          imageUrl: item.imageUrl || '',
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
        if (formState.generatedImageUrl) {
          setPreviewUrl(formState.generatedImageUrl);
          if (isEditMode && item) {
             // eslint-disable-next-line no-param-reassign
             item.imageUrl = formState.generatedImageUrl; // Update item in place for preview
          }
        }
        if (!isEditMode) { 
          form.reset(); 
          setPreviewUrl(undefined);
        }
        // Only redirect if not explicitly staying on page (e.g. due to image generation)
        if (!formState.generatedImageUrl || !isEditMode) {
          router.push('/admin/items'); 
        }
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
    }
    setIsSubmitting(false); 
  }, [formState, toast, form, router, isEditMode, item]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    await form.trigger(); 
    if (form.formState.isValid) {
      dispatchFormAction(formData);
    } else {
      setIsSubmitting(false); 
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

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'imageUrl') {
        setPreviewUrl(value.imageUrl);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


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
              <FormLabel>Image URL (Optional - will be auto-generated if left empty or placeholder)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Leave empty or https://placehold.co/600x400.png to auto-generate" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    setPreviewUrl(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
              {previewUrl && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="h-32 w-auto rounded-md object-cover border" />
                </div>
              )}
              {!previewUrl && !field.value && (
                <div className="mt-2 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                  <Images className="mx-auto h-10 w-10 mb-2" />
                  <p>An image will be auto-generated upon saving if this field is empty or a placeholder.</p>
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
