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
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Define the schema outside the component to avoid re-creation on each render
const contactFormSchema = z
  .object({
    name: z.string().min(1, { message: 'nameRequired' }),
    email: z
      .string()
      .optional()
      .refine(
        (email) => {
          // If email is provided, it must be valid
          if (email && email.trim() !== '') {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          }
          return true; // If no email is provided, this validation passes
        },
        { message: 'emailValid' }
      ),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10, { message: 'messageLength' }),
  })
  .refine(
    (data) => {
      // Ensure at least one of email or phone is provided
      // Check that at least one is not empty after trimming
      return (data.email && data.email.trim() !== '') || (data.phone && data.phone.trim() !== '');
    },
    {
      message: 'contactMethodRequired',
      path: ['email'], // This will show the error on the email field
    }
  );

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('contact.form');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real application, you would send the form data to a server
    // For this demo, we'll just show a success message
    toast({
      title: t('messages.success'),
      description: t('messages.successDescription'),
    });

    form.reset();
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.name')} {...field} />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('labels.email')} {t('labels.contactMethodNote')}
              </FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.email')} {...field} />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('labels.phone')} {t('labels.contactMethodNote')}
              </FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.phone')} {...field} />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.subject')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.subject')} {...field} />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('labels.message')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('placeholders.message')}
                  {...field}
                  rows={6}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage>{field.error && t(`validation.${field.error.message}`)}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('buttons.sending')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t('buttons.submit')}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
