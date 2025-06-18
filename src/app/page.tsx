import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ItemCard } from '@/components/shared/ItemCard';
import { getItems } from '@/lib/data';
import type { Item } from '@/types';

export default async function HomePage() {
  const items: Item[] = await getItems();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        <h1 className="text-4xl font-headline font-bold mb-8 text-center text-primary">
          Welcome to ItemDrop!
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Browse our collection of legendary game items. Contact us to purchase.
        </p>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-xl">No items currently available. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
