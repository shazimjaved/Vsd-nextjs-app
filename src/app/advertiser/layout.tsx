
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertiser | VSD Network',
  description: 'VSD Network Advertiser Portal',
};

export default function AdvertiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-screen w-full flex flex-col bg-muted/40")}>
        <div className="container mx-auto flex-grow px-4 py-8">
            {children}
        </div>
    </div>
  );
}
