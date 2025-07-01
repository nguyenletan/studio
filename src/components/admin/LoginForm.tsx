'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminLogin } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';

// We need to define the schema outside the component to avoid re-creation on each render
// but we'll use the translation function inside the component for error messages
const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'usernameRequired' }),
  password: z.string().min(1, { message: 'passwordRequired' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('adminLogin');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await adminLogin(data.username, data.password);
      if (result.success) {
        toast({
          title: t('messages.loginSuccess'),
          description: t('messages.redirecting'),
        });
        router.push('/admin');
        router.refresh(); // Ensure layout re-renders and auth state is fresh
      } else {
        toast({
          variant: 'destructive',
          title: t('messages.loginFailed'),
          description: result.error || t('messages.unknownError'),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('messages.loginError'),
        description: t('messages.unexpectedError'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-primary text-center text-3xl">
          {t('title')}
        </CardTitle>
        <CardDescription className="text-center">{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('labels.username')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('placeholders.username')} {...field} />
                  </FormControl>
                  <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('labels.password')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('placeholders.password')} {...field} />
                  </FormControl>
                  <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                t('buttons.loggingIn')
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> {t('buttons.login')}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
