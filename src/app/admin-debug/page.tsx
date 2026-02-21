'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  Users,
  KeyRound,
  BarChart2,
  List,
  Coins,
  Shield,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons/Logo';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavItem } from '@/types/nav';

const AdminNavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )}
    >
      {children}
    </Link>
);
  
const adminNavItems: NavItem[] = [
    { href: "/admin", title: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", title: "User Management", icon: Users },
    { href: "/admin/api-management", title: "API Management", icon: KeyRound },
    { href: "/admin/token-distribution", title: "Token Distribution", icon: Coins },
    { href: "/admin/activity", title: "Activity Logs", icon: List },
    { href: "/admin/analytics", title: "Analytics", icon: BarChart2 },
    { href: "/admin/notifications", title: "Notifications", icon: Bell },
];

export default function AdminDebugPage() {
  const { isLoading, isAdmin } = useProtectedRoute({ adminOnly: true });
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Signed Out", description: "You have been successfully signed out." });
    router.push('/login');
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Logo size={60} className="animate-pulse" />
            <p className="text-muted-foreground">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
         <div className="flex h-screen w-full items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="text-destructive"/> Access Denied</CardTitle>
                    <CardDescription>You do not have the required permissions to view this page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>You are being redirected.</p>
                </CardContent>
            </Card>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Logo size={32} />
              <span className="">VSD Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {adminNavItems.map((item) => (
                <AdminNavLink key={item.href} href={item.href} isActive={pathname === item.href}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </AdminNavLink>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
             <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>VSD Network</CardTitle>
                <CardDescription>
                  Return to the main user-facing site.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full" asChild>
                  <Link href="/">
                    Go to Main Site
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                    >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold mb-4"
                    >
                        <Logo size={32} />
                        <span className="sr-only">VSD Admin</span>
                    </Link>
                     {adminNavItems.map((item) => (
                        <AdminNavLink key={item.href} href={item.href} isActive={pathname === item.href}>
                        {item.icon && <item.icon className="h-5 w-5" />}
                        {item.title}
                        </AdminNavLink>
                    ))}
                    </nav>
                </SheetContent>
            </Sheet>

          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                    <AvatarImage src={user?.photoURL ?? undefined} />
                    <AvatarFallback>{user?.displayName?.charAt(0) ?? 'A'}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.displayName ?? user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/')}>Main Site</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Debug Page</CardTitle>
              <CardDescription>Debug information and tools for administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the admin debug page.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}