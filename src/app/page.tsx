import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ItemCard } from '@/components/shared/ItemCard';
import { getItems } from '@/lib/data';
import type { Item } from '@/types';

export default async function HomePage() {
  const items: Item[] = await getItems();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl flex-grow gap-4 py-8">
        <h1 className="font-headline mb-8 text-center text-4xl font-bold text-primary">CS Skins</h1>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          Danh sách các vật phẩm trong game CS Online
        </p>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-muted-foreground">Ko có sản phẩm nào cả!</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
