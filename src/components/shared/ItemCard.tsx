import type { Item } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const t = useTranslations('itemCard');
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={item.imageUrl}
            alt={item.name}
            layout="fill"
            objectFit="contain"
            className="rounded-t-lg"
            data-ai-hint={item.category.toLowerCase()}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="font-headline mb-2 text-xl">{item.name}</CardTitle>
        <CardDescription className="line-clamp-3 text-sm text-muted-foreground">
          {item.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-semibold text-primary">
          {item.price.toLocaleString()} {t('currency')}
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/item/${item.id}`}>
            {t('viewDetails')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
