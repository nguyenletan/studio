
import { getItemById } from '@/lib/data';
import type { Item } from '@/types';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Tag, Shield, Gem, ScrollText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await getItemById(params.id);
  if (!item) {
    return {
      title: 'Item Not Found',
    };
  }
  return {
    title: `${item.name} - ItemDrop`,
    description: item.description,
  };
}

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const item: Item | undefined = await getItemById(params.id);

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-8 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Item Not Found</h1>
          <p className="text-muted-foreground mb-8">The item you are looking for does not exist.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'weapon': return <Gem className="h-5 w-5 text-primary" />;
      case 'armor': return <Shield className="h-5 w-5 text-primary" />;
      case 'potion': return <ScrollText className="h-5 w-5 text-primary" />; // Using ScrollText for potion
      default: return <Tag className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-square md:aspect-auto">
              <Image
                src={item.imageUrl}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint={item.category.toLowerCase()}
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-4xl font-headline font-bold text-primary">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <div className="flex items-center space-x-2 mb-4">
                  {categoryIcon(item.category)}
                  <Badge variant="secondary" className="text-sm">{item.category}</Badge>
                </div>
                <p className="text-2xl font-semibold text-accent mb-6">{item.price.toLocaleString()} Gold</p>
                <CardDescription className="text-base text-foreground mb-4">
                  {item.description}
                </CardDescription>
                {item.longDescription && (
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                    <p>{item.longDescription}</p>
                  </div>
                )}
              </CardContent>
              <div className="mt-8 p-0">
                 <p className="text-sm text-muted-foreground">To purchase this item, please contact us directly.</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
