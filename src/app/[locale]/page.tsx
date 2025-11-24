import {useTranslations} from 'next-intl';
import {Link} from '@/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function Home() {
  const t = useTranslations('Home');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 sm:py-12 bg-transparent relative overflow-hidden">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-2 sm:px-8 md:px-20 text-center z-10 max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight">
            {t.rich('title', {
              highlight: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">{chunks}</span>,
              br: () => <br />
            })}
          </h1>

          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-20">
          <Link href="/calculator?step=income">
            <Button size="lg" className="w-full sm:w-auto text-base xs:text-lg px-6 xs:px-8 py-4 xs:py-6 sm:px-12 sm:py-8 h-auto shadow-xl shadow-primary/20 hover:shadow-primary/40 animate-pulse-glow">
              {t('startAnalysis')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full text-left">
          <Card className="h-full w-full max-w-md mx-auto hover:scale-[1.02] transition-transform duration-300">
            <CardHeader>
              <CardTitle className="text-lg sm:text-2xl">{t('collateralAnalysis')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {t('collateralDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="h-full w-full max-w-md mx-auto hover:scale-[1.02] transition-transform duration-300">
            <CardHeader>
              <CardTitle className="text-lg sm:text-2xl">{t('stressTesting')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {t('stressDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="h-full w-full max-w-md mx-auto hover:scale-[1.02] transition-transform duration-300">
            <CardHeader>
              <CardTitle className="text-lg sm:text-2xl">{t('investmentPlanning')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {t('investmentDesc')}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-20 sm:h-24 mt-8 sm:mt-12 border-t border-border/50 backdrop-blur-sm z-10 px-2">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          {t('footer')}
        </p>
      </footer>
    </div>
  );
}
