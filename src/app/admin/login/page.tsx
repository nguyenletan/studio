import { LoginForm } from '@/components/admin/LoginForm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Gamepad2 } from 'lucide-react';

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <div className="absolute left-8 top-8 flex items-center space-x-2 text-primary-foreground">
        <Gamepad2 className="h-10 w-10 text-primary" />
        <span className="font-headline text-2xl font-bold text-primary">Cs Skins</span>
      </div>
      <LoginForm />
    </div>
  );
}
