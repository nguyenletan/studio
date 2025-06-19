import type { Item } from '@/types';
import prisma from './prisma';

export async function getItems(): Promise<Item[]> {
  const itemsFromDb = await prisma.item.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return itemsFromDb.map((item) => ({
    ...item,
    // Ensure price is a number if it's stored differently or for consistency,
    // though Prisma's Float should map to number directly.
    price: Number(item.price),
  }));
}

export async function getItemById(id: string): Promise<Item | null> {
  const itemFromDb = await prisma.item.findUnique({
    where: { id },
  });
  if (!itemFromDb) {
    return null;
  }
  return {
    ...itemFromDb,
    price: Number(itemFromDb.price),
  };
}

export async function addItem(
  itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Item> {
  const newItem = await prisma.item.create({
    data: {
      ...itemData,
      price: Number(itemData.price), // Ensure price is stored as a number if needed by schema
    },
  });
  return {
    ...newItem,
    price: Number(newItem.price),
  };
}

export async function updateItem(
  id: string,
  itemData: Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Item | null> {
  try {
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        ...itemData,
        ...(itemData.price !== undefined && { price: Number(itemData.price) }),
      },
    });
    return {
      ...updatedItem,
      price: Number(updatedItem.price),
    };
  } catch (error: any) {
    // P2025 is "Record to update not found."
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}

export async function deleteItem(id: string): Promise<boolean> {
  try {
    await prisma.item.delete({
      where: { id },
    });
    return true;
  } catch (error: any) {
    // P2025 is "Record to delete does not exist."
    if (error.code === 'P2025') {
      return false;
    }
    return false;
  }
}
