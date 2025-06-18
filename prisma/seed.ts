import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialItems = [
  {
    name: 'Excalibur',
    description: 'A legendary sword of immense power.',
    longDescription: 'Forged in dragon fire and blessed by ancient spirits, Excalibur is a blade destined for heroes. Its shimmering edge can cleave through the toughest armor, and it glows with a soft blue light in the presence of evil.',
    price: 10000,
    imageUrl: 'https://placehold.co/600x400.png', // Will be replaced by AI if form logic is triggered
    category: 'Weapon',
  },
  {
    name: 'Aegis Shield',
    description: 'An impenetrable shield, blessed by the gods.',
    longDescription: 'The Aegis Shield was a gift from the heavens, capable of deflecting any blow, magical or mundane. Its surface is adorned with intricate carvings depicting epic battles of old.',
    price: 7500,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Armor',
  },
  {
    name: 'Elixir of Life',
    description: 'A rare potion that can restore vitality.',
    longDescription: 'Brewed from the rarest herbs found only in hidden groves, the Elixir of Life can mend grievous wounds and restore the drinker to full health. Its taste is said to be like liquid starlight.',
    price: 500,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Potion',
  },
  {
    name: 'Shadow Cloak',
    description: 'A cloak that grants near invisibility.',
    longDescription: 'Woven from threads of night itself, the Shadow Cloak allows its wearer to blend seamlessly with the darkness, becoming virtually undetectable to the untrained eye.',
    price: 3200,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Apparel',
  },
  {
    name: 'Dragonscale Armor',
    description: 'Full plate armor made from dragon scales.',
    longDescription: 'This formidable armor offers unparalleled protection against physical attacks and elemental magic. Each scale is harder than steel and imbued with the dragon\'s resilient nature.',
    price: 15000,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Armor',
  },
  {
    name: 'Staff of the Archmage',
    description: 'A powerful staff for casting potent spells.',
    longDescription: 'Carved from an ancient, mana-infused tree, this staff amplifies the wielder\'s magical abilities, allowing them to channel devastating spells with greater ease and potency.',
    price: 12000,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Weapon',
  }
];

async function main() {
  console.log('Start seeding ...');
  for (const item of initialItems) {
    const createdItem = await prisma.item.create({
      data: item,
    });
    console.log(`Created item with id: ${createdItem.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
