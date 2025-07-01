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
    <div className="from-background to-primary/10 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-4">
      <div className="text-primary-foreground absolute top-8 left-8 flex items-center space-x-2">
        <Gamepad2 className="text-primary h-10 w-10" />
        <span className="font-headline text-primary text-2xl font-bold">Cs Skins</span>
      </div>
      <LoginForm />
    </div>
  );
}
