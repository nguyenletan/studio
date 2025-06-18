import type { Item } from '@/types';

// In-memory store for items
let items: Item[] = [
  {
    id: '1',
    name: 'Excalibur',
    description: 'A legendary sword of immense power.',
    longDescription: 'Forged in dragon fire and blessed by ancient spirits, Excalibur is a blade destined for heroes. Its shimmering edge can cleave through the toughest armor, and it glows with a soft blue light in the presence of evil.',
    price: 10000,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Weapon',
  },
  {
    id: '2',
    name: 'Aegis Shield',
    description: 'An impenetrable shield, blessed by the gods.',
    longDescription: 'The Aegis Shield was a gift from the heavens, capable of deflecting any blow, magical or mundane. Its surface is adorned with intricate carvings depicting epic battles of old.',
    price: 7500,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Armor',
  },
  {
    id: '3',
    name: 'Elixir of Life',
    description: 'A rare potion that can restore vitality.',
    longDescription: 'Brewed from the rarest herbs found only in hidden groves, the Elixir of Life can mend grievous wounds and restore the drinker to full health. Its taste is said to be like liquid starlight.',
    price: 500,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Potion',
  },
  {
    id: '4',
    name: 'Shadow Cloak',
    description: 'A cloak that grants near invisibility.',
    longDescription: 'Woven from threads of night itself, the Shadow Cloak allows its wearer to blend seamlessly with the darkness, becoming virtually undetectable to the untrained eye.',
    price: 3200,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Apparel',
  },
  {
    id: '5',
    name: 'Dragonscale Armor',
    description: 'Full plate armor made from dragon scales.',
    longDescription: 'This formidable armor offers unparalleled protection against physical attacks and elemental magic. Each scale is harder than steel and imbued with the dragon\'s resilient nature.',
    price: 15000,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Armor',
  },
  {
    id: '6',
    name: 'Staff of the Archmage',
    description: 'A powerful staff for casting potent spells.',
    longDescription: 'Carved from an ancient, mana-infused tree, this staff amplifies the wielder\'s magical abilities, allowing them to channel devastating spells with greater ease and potency.',
    price: 12000,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Weapon',
  }
];

export async function getItems(): Promise<Item[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return items;
}

export async function getItemById(id: string): Promise<Item | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return items.find(item => item.id === id);
}

export async function addItem(itemData: Omit<Item, 'id'>): Promise<Item> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newItem: Item = {
    ...itemData,
    id: String(Date.now() + Math.random()), // Simple unique ID
  };
  items.push(newItem);
  return newItem;
}

export async function updateItem(id: string, itemData: Partial<Omit<Item, 'id'>>): Promise<Item | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return null;
  }
  items[itemIndex] = { ...items[itemIndex], ...itemData };
  return items[itemIndex];
}

export async function deleteItem(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const initialLength = items.length;
  items = items.filter(item => item.id !== id);
  return items.length < initialLength;
}
