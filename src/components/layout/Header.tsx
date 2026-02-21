
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, User, LogOut, ChevronDown, type LucideIcon, Share2, Disc, PiggyBank, Briefcase, GraduationCap, Group, Search, Route, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useAuth, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { doc } from 'firebase/firestore';
import type { Account } from '@/types/account';
import { NavItem } from '@/types/nav';

const NavLink = ({ href, children, currentPathname }: { href: string, children: React.ReactNode, currentPathname: string }) => (
    <Link
        href={href}
        className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            currentPathname === href ? "text-primary" : "text-foreground/70"
        )}
        suppressHydrationWarning
    >
        {children}
    </Link>
);


const NavDropdown = ({ item, currentPathname }: { item: NavItem, currentPathname: string }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn(
                "text-sm font-medium transition-colors hover:text-primary focus:bg-accent focus:text-accent-foreground",
                currentPathname.startsWith(item.href) ? "text-primary" : "text-foreground/70"
            )}>
                {item.title}
                <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>{item.description}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.subItems?.map(subItem => (
                <DropdownMenuItem key={subItem.href} asChild>
                    <Link href={subItem.href} suppressHydrationWarning>{subItem.title}</Link>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);


const UserNav = () => {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const accountDocRef = useMemoFirebase(() => (user && firestore ? doc(firestore, 'accounts', user.uid) : null), [user, firestore]);
    const { data: account, isLoading: isAccountLoading } = useDoc<Account>(accountDocRef);

    const handleSignOut = async () => {
        if (!auth) return;
        await signOut(auth);
        toast({ title: "Signed Out", description: "You have been successfully signed out." });
        router.push('/');
    };

    if (isUserLoading) {
        return <Skeleton className="h-10 w-10 rounded-full" />;
    }
    
    if (!user) {
        return (
            <Button asChild>
                <Link href="/login"><User className="mr-2 h-4 w-4"/>Login</Link>
            </Button>
        );
    }

    // --- Super Admin Bootstrap for UI Visibility ---
    const isSuperAdmin = user.email === 'support@vndrmusic.com';
    
    const rolesAreLoading = isAccountLoading;
    const userRoles = account?.roles || [];
    // Grant admin role visually if super admin or if in roles
    const isAdmin = isSuperAdmin || userRoles.includes('admin');
    const isAdvertiser = userRoles.includes('advertiser');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                        <AvatarFallback>
                            {user.displayName?.charAt(0) ?? <User className="h-5 w-5" />}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {siteConfig.userNav.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                           <Link href={item.href}>
                               {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                               <span>{item.title}</span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                    {(isAdmin || isAdvertiser || rolesAreLoading) && <DropdownMenuSeparator />}
                    {rolesAreLoading && !isSuperAdmin && (
                        <DropdownMenuItem disabled>
                            <Skeleton className="h-4 w-32" />
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                           <Link href="/admin">
                               <Shield className="mr-2 h-4 w-4" />
                               <span>Admin Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {!rolesAreLoading && isAdvertiser && (
                        <DropdownMenuItem asChild>
                           <Link href="/advertiser">
                               <Briefcase className="mr-2 h-4 w-4" />
                               <span>Advertiser Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const isSpecialPage = pathname.startsWith('/admin') || pathname.startsWith('/advertiser');


  const navItems = siteConfig.mainNav.map((item) => {
      if (item.subItems) {
          return <NavDropdown key={item.href} item={item} currentPathname={pathname} />;
      }
      return (
        <NavLink key={item.href} href={item.href} currentPathname={pathname}>
          {item.title}
        </NavLink>
      );
  });
  
  const headerClasses = "sticky top-0 z-50 w-full animated-gradient-background mask-gradient-to-bottom";

  return (
    <header className={cn(headerClasses)} suppressHydrationWarning>
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6" suppressHydrationWarning>
            <Logo size={36} />
            <span className="font-bold sm:inline-block">VSD Network</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1 flex-grow">
          { !isSpecialPage && navItems }
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
           <UserNav />

            { !isSpecialPage && (
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Navigation Menu</SheetTitle>
                            <SheetDescription>Main navigation links for the VSD Network website.</SheetDescription>
                        </SheetHeader>
                        <SheetClose asChild>
                            <Link href="/" className="mb-6 flex items-center">
                                <Logo size={36} className="mr-2" />
                            </Link>
                        </SheetClose>
                    <nav className="flex flex-col space-y-4">
                        {siteConfig.mainNav.map((item) => (
                        <SheetClose asChild key={item.href}>
                            <Link href={item.href} className="text-lg font-medium transition-colors hover:text-primary text-foreground/80">
                                {item.title}
                            </Link>
                        </SheetClose>
                        ))}
                        <DropdownMenuSeparator />
                        {siteConfig.secondaryNav.map((item) => (
                            <SheetClose asChild key={item.href}>
                                <Link href={item.href} className="text-lg font-medium transition-colors hover:text-primary text-foreground/80">
                                    {item.title}
                                </Link>
                            </SheetClose>
                        ))}
                        <DropdownMenuSeparator />
                        <SheetClose asChild>
                            <Link href="/developers/integration" className="text-lg font-medium transition-colors hover:text-primary text-foreground/80 flex items-center">
                                <Share2 className="mr-2 h-4 w-4" /> Integration Guide
                            </Link>
                        </SheetClose>
                    </nav>
                    </SheetContent>
                </Sheet>
              </div>
            )}
        </div>
      </div>
    </header>
  );
}
