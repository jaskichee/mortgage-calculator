import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"
import { SettingsPill } from "@/components/ui/SettingsPill";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BackgroundOrbs } from "@/components/ui/BackgroundOrbs";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
 
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased min-h-screen font-sans bg-background text-foreground relative overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <BackgroundOrbs />
            <div className="relative z-10">
              <div className="fixed bottom-6 right-6 z-50 print:hidden">
                <SettingsPill />
              </div>
              {children}
              <SpeedInsights />
              <Analytics />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
