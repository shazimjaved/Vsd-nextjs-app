
'use client';

import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from '@/config/site';
import { Orbitron, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { BackgroundVideo } from '@/components/layout/BackgroundVideo';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Web3Provider } from '@/components/providers/Web3Provider';

const fontHeadline = Orbitron({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const isSpecialLayout = pathname.startsWith('/admin') || pathname.startsWith('/advertiser');
  
  const pageVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
  };

  const pageTransition = {
    duration: shouldReduceMotion ? 0 : 0.5,
    ease: 'easeInOut',
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vsd-network.web.app';
  const ogImageUrl = 'https://i.ibb.co/Kpg55CcY/Adobe-Express-20250422-1254090-1.png';

  return (
    <html lang="en" className={cn("dark", fontHeadline.variable, fontBody.variable)} suppressHydrationWarning>
      <head>
         <link rel="icon" href="https://i.ibb.co/Kpg55CcY/Adobe-Express-20250422-1254090-1.png" />
         <meta name="description" content={siteConfig.description} />
        <meta property="og:title" content={siteConfig.name} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.name} />
        <meta name="twitter:description" content={siteConfig.description} />
        <meta name="twitter:image" content={ogImageUrl} />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col relative bg-background" suppressHydrationWarning>
        <Web3Provider>
          <FirebaseClientProvider>
            {!isSpecialLayout && <BackgroundVideo />}
            <div className={cn("relative z-0 flex flex-col min-h-screen w-full")}>
              <Header />
              <AnimatePresence mode="wait">
                <motion.main
                  key={pathname}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="flex-grow w-full max-w-screen-2xl mx-auto"
                >
                  <div className="h-full my-4 p-4 sm:p-6 lg:p-8">
                    {children}
                  </div>
                </motion.main>
              </AnimatePresence>
              {!isSpecialLayout && <Footer />}
              <Toaster />
            </div>
          </FirebaseClientProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
