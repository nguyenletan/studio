'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as auth from './auth';
import * as data from './data';
import type { Item } from '@/types';
import * as z from 'zod';
import { generateItemImage } from '@/ai/flows/generate-item-image-flow';

// Login Action
export async function adminLogin(username?: string, password?: string) {
  const result = await auth.login(username, password);
  if (result.success) {
    revalidatePath('/admin');
  }
  return result;
}

// Logout Action
export async function adminLogout() {
  await auth.logout();
  revalidatePath('/admin/login');
  revalidatePath('/admin');
}

// Zod Schema for Item validation (form input)
const ItemFormInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')), // Optional for form, will be generated if empty
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
  generatedImageUrl?: string; // To pass back the URL of a newly generated image
};

// Create Item Action
export async function createItemAction(
  prevState: ItemFormState | undefined,
  formData: FormData
): Promise<ItemFormState> {
  const validatedFields = ItemFormInputSchema.safeParse({
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

  let imageUrl = validatedFields.data.imageUrl;
  let generatedImageUrl: string | undefined = undefined;

  if (!imageUrl || imageUrl.startsWith('https://placehold.co')) {
    try {
      const imageResult = await generateItemImage({
        itemName: validatedFields.data.name,
        itemCategory: validatedFields.data.category,
      });
      imageUrl = imageResult.imageDataUri;
      generatedImageUrl = imageUrl;
    } catch (genError) {
      console.error('Image generation failed:', genError);
      // Decide if this is a critical error or if we can proceed without an image / with a default
      // For now, let's proceed with a placeholder or empty, but a real app might handle this differently
      imageUrl = 'https://placehold.co/600x400.png'; // Fallback placeholder
      // Optionally, add a non-blocking message to the user
    }
  }

  const itemDataToSave: Omit<Item, 'id'> = {
    ...validatedFields.data,
    imageUrl: imageUrl, // Ensure imageUrl is always a string
  };

  try {
    const newItem = await data.addItem(itemDataToSave);
    revalidatePath('/admin/items');
    revalidatePath('/');
    return {
      message: `Item "${newItem.name}" created successfully! ${generatedImageUrl ? 'Image was auto-generated.' : ''}`,
      success: true,
      generatedImageUrl: generatedImageUrl,
    };
  } catch (error) {
    return {
      message: 'Failed to create item.',
      success: false,
      errors: { _form: ['Database error.'] },
    };
  }
}

// Update Item Action
export async function updateItemAction(
  id: string,
  prevState: ItemFormState | undefined,
  formData: FormData
): Promise<ItemFormState> {
  const validatedFields = ItemFormInputSchema.safeParse({
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

  let imageUrl = validatedFields.data.imageUrl;
  let generatedImageUrl: string | undefined = undefined;

  if (!imageUrl || imageUrl.startsWith('https://placehold.co')) {
    try {
      const imageResult = await generateItemImage({
        itemName: validatedFields.data.name,
        itemCategory: validatedFields.data.category,
      });
      imageUrl = imageResult.imageDataUri;
      generatedImageUrl = imageUrl;
    } catch (genError) {
      console.error('Image generation failed during update:', genError);
      // Fallback to existing image if generation fails or a default placeholder if no existing one
      const existingItem = await data.getItemById(id);
      imageUrl = existingItem?.imageUrl || 'https://placehold.co/600x400.png';
    }
  }

  const itemDataToUpdate: Partial<Omit<Item, 'id'>> = {
    ...validatedFields.data,
    imageUrl: imageUrl, // Ensure imageUrl is always a string
  };

  try {
    const updatedItem = await data.updateItem(id, itemDataToUpdate);
    if (!updatedItem) {
      return { message: 'Item not found or failed to update.', success: false };
    }
    revalidatePath('/admin/items');
    revalidatePath(`/admin/items/${id}/edit`);
    revalidatePath(`/item/${id}`);
    revalidatePath('/');
    return {
      message: `Item "${updatedItem.name}" updated successfully! ${generatedImageUrl ? 'Image was auto-generated.' : ''}`,
      success: true,
      generatedImageUrl: generatedImageUrl,
    };
  } catch (error) {
    return {
      message: 'Failed to update item.',
      success: false,
      errors: { _form: ['Database error.'] },
    };
  }
}

// Delete Item Action
export async function deleteItemAction(
  id: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const success = await data.deleteItem(id);
    if (success) {
      revalidatePath('/admin/items');
      revalidatePath('/');
      return { success: true, message: 'Item deleted successfully.' };
    }
    return { success: false, message: 'Failed to delete item or item not found.' };
  } catch (error) {
    return { success: false, message: 'An error occurred while deleting the item.' };
  }
}
