
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useUser } from '@/firebase';
import { Shield } from 'lucide-react';
import { Logo } from '@/components/icons/Logo';

export default function AdminStablePage() {
  // Use the corrected protected route hook
  const { isLoading, isAdmin } = useProtectedRoute({ adminOnly: true });
  const { user, isUserLoading } = useUser();

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
                    <p>Redirecting you to a safe place.</p>
                </CardContent>
            </Card>
      </div>
    );
  }

  // If access is granted, show the stable dashboard
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Stable Admin Dashboard</h1>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="text-green-500">Access Guaranteed</CardTitle>
                <CardDescription>
                    You have been granted access as a super administrator. This is the stable access point.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Welcome, {user?.displayName || user?.email}.</p>
                <p>All core admin functionalities will be built out from this stable foundation.</p>
                <Button asChild>
                    <Link href="/admin">Go to Main Admin Dashboard</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
