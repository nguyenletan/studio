import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ContactForm } from '@/components/shared/ContactForm';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone, Clock, MessageCircle, Send } from 'lucide-react';

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: `${t('contact.title')} - CS Skins`,
    description: t('contact.description'),
  };
}

export default async function ContactPage() {
  const t = await getTranslations();

  // Get contact information from environment variables
  const address = process.env.NEXT_ADDRESS || '';
  const email = process.env.NEXT_EMAIL || '';
  const phone = process.env.NEXT_TEL_NUM || '';
  const phone2 = process.env.NEXT_TEL_NUM2 || '';
  const facebookMessenger = process.env.NEXT_FACEBOOK_MESSENGER || '';
  const telegram = process.env.NEXT_TELEGRAM || '';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl flex-grow py-8">
        <h1 className="font-headline text-primary mb-8 text-center text-4xl font-bold">
          {t('contact.title')}
        </h1>
        <p className="text-muted-foreground mb-12 text-center text-lg">
          {t('contact.description')}
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contact.formTitle')}</CardTitle>
              <CardDescription>{t('contact.formDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contact.contactInfo')}</CardTitle>
              <CardDescription>CS Skins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-primary mt-1 h-5 w-5" />
                <div>
                  <h3 className="font-medium">{address}</h3>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-primary mt-1 h-5 w-5" />
                <div>
                  <h3 className="font-medium">{email}</h3>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-primary mt-1 h-5 w-5" />
                <div>
                  <h3 className="font-medium">
                    {phone} - {phone2}
                  </h3>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-primary mt-1 h-5 w-5" />
                <div>
                  <h3 className="font-medium">{t('contact.businessHours')}</h3>
                  <p className="text-muted-foreground text-sm">
                    {t('contact.businessHoursDetails')}
                  </p>
                </div>
              </div>

              {facebookMessenger && (
                <div className="flex items-start space-x-4">
                  <MessageCircle className="text-primary mt-1 h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Facebook Messenger</h3>
                    <p className="text-muted-foreground text-sm">{facebookMessenger}</p>
                  </div>
                </div>
              )}

              {telegram && (
                <div className="flex items-start space-x-4">
                  <Send className="text-primary mt-1 h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Telegram</h3>
                    <p className="text-muted-foreground text-sm">{telegram}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
