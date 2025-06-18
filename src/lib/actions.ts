'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as auth from './auth';
import * as data from './data';
import type { Item } from '@/types';
import * as z from 'zod';

// Login Action
export async function adminLogin(username?: string, password?: string) {
  const result = await auth.login(username, password);
  if (result.success) {
    // Revalidate a common admin path to ensure auth state is fresh if middleware relies on it somehow,
    // though redirect itself should be enough.
    revalidatePath('/admin');
  }
  return result;
}

// Logout Action
export async function adminLogout() {
  await auth.logout();
  revalidatePath('/admin/login'); // Or any public page
  revalidatePath('/admin');
}

// Zod Schema for Item validation
const ItemSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
  category: z.string().min(1, 'Category is required'),
});

export type ItemFormState = {
  message?: string;
  errors?: {
    name?: string[];
    description?: string[];
    longDescription?: string[];
    price?: string[];
    imageUrl?: string[];
    category?: string[];
    _form?: string[];
  };
  success: boolean;
};


// Create Item Action
export async function createItemAction(
  prevState: ItemFormState | undefined,
  formData: FormData
): Promise<ItemFormState> {
  const validatedFields = ItemSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    longDescription: formData.get('longDescription'),
    price: formData.get('price'),
    imageUrl: formData.get('imageUrl'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }

  try {
    const newItem = await data.addItem(validatedFields.data as Omit<Item, 'id'>);
    revalidatePath('/admin/items'); // Revalidate the items list page
    revalidatePath('/'); // Revalidate public listing
    // redirect('/admin/items'); // Don't redirect from form action, return success instead
    return { message: `Item "${newItem.name}" created successfully!`, success: true };
  } catch (error) {
    return { message: 'Failed to create item.', success: false, errors: { _form: ['Database error.']} };
  }
}

// Update Item Action
export async function updateItemAction(
  id: string,
  prevState: ItemFormState | undefined,
  formData: FormData
): Promise<ItemFormState> {
   const validatedFields = ItemSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    longDescription: formData.get('longDescription'),
    price: formData.get('price'),
    imageUrl: formData.get('imageUrl'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }
  
  try {
    const updatedItem = await data.updateItem(id, validatedFields.data as Partial<Omit<Item, 'id'>>);
    if (!updatedItem) {
      return { message: 'Item not found or failed to update.', success: false };
    }
    revalidatePath('/admin/items');
    revalidatePath(`/admin/items/${id}/edit`);
    revalidatePath(`/item/${id}`); // Revalidate public detail page
    revalidatePath('/'); // Revalidate public listing
    return { message: `Item "${updatedItem.name}" updated successfully!`, success: true };
  } catch (error) {
     return { message: 'Failed to update item.', success: false, errors: { _form: ['Database error.']} };
  }
}

// Delete Item Action
export async function deleteItemAction(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const success = await data.deleteItem(id);
    if (success) {
      revalidatePath('/admin/items');
      revalidatePath('/'); // Revalidate public listing
      return { success: true, message: 'Item deleted successfully.' };
    }
    return { success: false, message: 'Failed to delete item or item not found.' };
  } catch (error) {
    return { success: false, message: 'An error occurred while deleting the item.' };
  }
}
