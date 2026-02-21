
import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = siteConfig.mainNav
    .filter(item => !item.href.includes('#') && !item.subItems) // Filter out hash links and parent dropdowns
    .map((item) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: item.href === '/' ? 1 : 0.8,
    }));
    
  const secondaryPages = siteConfig.secondaryNav.map((item) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
  }));
  
  const docPages = (siteConfig.mainNav.find(item => item.href === '/developers')?.subItems || []).map((item) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
  }));

  const tokenPages = (siteConfig.mainNav.find(item => item.href === '/token')?.subItems || []).map((item) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
  }));
  
  const otherPages = [
    { url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/compliance`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/login`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
  ];

  return [
    ...staticPages,
    ...secondaryPages,
    ...docPages,
    ...tokenPages,
    ...otherPages
  ];
}
