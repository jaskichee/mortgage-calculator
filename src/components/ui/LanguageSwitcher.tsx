'use client';

import {useLocale} from 'next-intl';
import {useRouter, usePathname} from '@/navigation';
import {useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/Button';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleLanguage = () => {
    const nextLocale = locale === 'sl' ? 'en' : 'sl';
    const params = searchParams.toString();
    const href = params ? `${pathname}?${params}` : pathname;
    router.replace(href, {locale: nextLocale});
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="w-10 h-10 p-0 font-bold">
      {locale === 'sl' ? 'SL' : 'EN'}
    </Button>
  );
}
