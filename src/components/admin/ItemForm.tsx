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
import { useTranslations } from 'next-intl';
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
} from '@/components/ui/alert-dialog';

// We need to define the schema outside the component to avoid re-creation on each render
// but we'll use the translation function inside the component for error messages
const itemFormSchema = z.object({
  name: z.string().min(3, { message: 'nameLength' }),
  description: z.string().min(10, { message: 'descriptionLength' }),
  longDescription: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'positivePrice' }),
  imageUrl: z.string().url({ message: 'validUrl' }).optional().or(z.literal('')),
  category: z.string().min(1, { message: 'requiredCategory' }),
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
  const t = useTranslations('adminItemForm');

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
          title: isEditMode ? t('messages.updateSuccess') : t('messages.createSuccess'),
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
          title: isEditMode ? t('messages.updateFailed') : t('messages.createFailed'),
          description: formState.message || t('messages.errorOccurred'),
        });
      }
    }
    if (formState?.errors) {
      // Set form errors manually if needed, or rely on zodResolver
    }
    setIsSubmitting(false);
  }, [formState, toast, form, router, isEditMode, item, t]);

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
        title: t('messages.validationError'),
        description: t('validation.formErrors'),
      });
    }
  };

  const handleDelete = async () => {
    if (!item || !item.id || !deleteAction) return;
    setIsDeleting(true);
    const result = await deleteAction(item.id);
    if (result.success) {
      toast({ title: t('messages.itemDeleted'), description: result.message });
      router.push('/admin/items');
    } else {
      toast({
        variant: 'destructive',
        title: t('messages.deletionFailed'),
        description: result.message,
      });
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
              <FormLabel>{t('labels.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.name')} {...field} />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.shortDescription')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('placeholders.shortDescription')} {...field} rows={3} />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.longDescription')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('placeholders.longDescription')} {...field} rows={6} />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('labels.price')}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={t('placeholders.price')} {...field} />
                </FormControl>
                <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('labels.category')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.category')} {...field} />
                </FormControl>
                <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.imageUrl')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('placeholders.imageUrl')}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setPreviewUrl(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
              {previewUrl && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-32 w-auto rounded-md border object-cover"
                  />
                </div>
              )}
              {!previewUrl && !field.value && (
                <div className="mt-2 rounded-md border border-dashed p-4 text-center text-muted-foreground">
                  <Images className="mx-auto mb-2 h-10 w-10" />
                  <p>{t('messages.imageAutoGenerate')}</p>
                </div>
              )}
            </FormItem>
          )}
        />

        {formState?.errors?._form && (
          <FormMessage className="rounded-md bg-destructive p-3 text-destructive-foreground">
            {formState.errors._form.join(', ')}
          </FormMessage>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting
              ? isEditMode
                ? t('buttons.saving')
                : t('buttons.creating')
              : isEditMode
                ? t('buttons.saveChanges')
                : t('buttons.createItem')}
          </Button>
          {isEditMode && deleteAction && item && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isDeleting || isSubmitting}>
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  {isDeleting ? t('buttons.deleting') : t('buttons.deleteItem')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('deleteConfirmation.title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('deleteConfirmation.description', { name: item.name })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>{t('buttons.cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('buttons.confirmDelete')}
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
