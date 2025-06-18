import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">ItemDrop</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
