
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { Separator } from '@/components/ui/separator';
import { Logo } from '../icons/Logo';
import { cn } from '@/lib/utils';

export function Footer() {
  return (
    <footer className={cn("border-t border-border/40 animated-gradient-background")} suppressHydrationWarning>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* Main Links */}
          <div className="flex flex-col gap-2 p-4 rounded-lg col-span-2 sm:col-span-1">
            <h4 className="font-bold mb-2">Platform</h4>
            <Link href="/token" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>VSD Token</Link>
            <Link href="/ecosystem" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Ecosystem</Link>
            <Link href="/buy" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Buy VSD</Link>
            <Link href="/earn" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Earn VSD</Link>
          </div>

          {/* Developer Links */}
          <div className="flex flex-col gap-2 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Developers</h4>
            <Link href="/developers/documentation" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Whitepaper</Link>
            <Link href="/developers/api-reference" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>API Reference</Link>
            <Link href="/developers/integration" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Integration Guide</Link>
            <Link href="/developers" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Developer Portal</Link>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-2 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Company</h4>
            <Link href="/network-status" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Network Status</Link>
            <Link href="/for-businesses" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>For Businesses</Link>
            <Link href="/compliance" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Compliance</Link>
            <Link href="/symbi" className="text-muted-foreground hover:text-primary transition-colors" suppressHydrationWarning>Knowledge Base</Link>
          </div>

          {/* VSD Network Info */}
          <div className="flex flex-col gap-2 p-4 rounded-lg">
             <div className="flex items-center gap-2 mb-2">
              <Logo size={24} />
              <span className="font-headline font-bold">{siteConfig.name}</span>
            </div>
             <p className="text-xs text-muted-foreground">The official financial infrastructure for the Independent Media Group (IMG).</p>
          </div>
        </div>
        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">The VSD Token is a utility token and is not intended to constitute a security. Please read our legal disclaimer before participating.</p>
        <Separator className="my-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} VSD Network. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>An</span>
                <Link href="https://indiemedia.llc" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity" suppressHydrationWarning>
                    <Image
                        src="/img-logo-v2.png?v=3"
                        alt="Audio Exchange Logo"
                        width={100}
                        height={25}
                        className="object-contain"
                        unoptimized
                    />
                </Link>
                <span>Company</span>
            </div>
        </div>
      </div>
    </footer>
  );
}
