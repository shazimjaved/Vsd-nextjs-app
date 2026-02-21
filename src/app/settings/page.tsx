
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Wallet, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useUser, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { doc } from "firebase/firestore";
import type { Account } from "@/types/account";

const notificationSettings = [
    { id: 'balanceChanges', label: 'Balance Changes', description: 'Get notified about token transfers and staking rewards.' },
    { id: 'promotions', label: 'Promotional Announcements', description: 'Receive updates on new features and special offers.' },
    { id: 'governance', label: 'Governance Alerts', description: 'Stay informed about new proposals and voting periods.' },
    { id: 'security', label: 'Security Alerts', description: 'Receive alerts for login activity and other security events.' },
];

export default function SettingsPage() {
    const { toast } = useToast();
    const { isLoading: isAuthLoading } = useProtectedRoute();
    const { user } = useUser();
    const firestore = useFirestore();

    const accountRef = useMemoFirebase(() => user && firestore ? doc(firestore, 'accounts', user.uid) : null, [firestore, user]);
    const { data: account, isLoading: isAccountLoading } = useDoc<Account>(accountRef);

    const isLoading = isAuthLoading || isAccountLoading;

    const handleSaveChanges = () => {
        // In a real app, you would save the settings to a backend.
        toast({
            title: "Settings Saved",
            description: "Your notification preferences have been updated.",
        });
    };

    const handleCopyAddress = () => {
        if (!account?.walletAddress) return;
        navigator.clipboard.writeText(account.walletAddress);
        toast({ title: 'Wallet Address Copied' });
    };

    if (isLoading || !user) {
        return (
            <div className="space-y-12 py-8">
                 <header className="text-center">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                </header>
                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="md:col-span-1"><Skeleton className="h-full w-full" /></Card>
                    <Card className="md:col-span-2"><Skeleton className="h-full w-full" /></Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 py-8">
            <header className="text-center">
                <User className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">User Settings</h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Manage your profile information and notification preferences.
                </p>
            </header>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1 shadow-lg bg-card/80 backdrop-blur-sm">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-primary/50">
                           <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                           <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="font-headline text-2xl">{user.displayName}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                         <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
                            {isAccountLoading ? <Skeleton className="h-4 w-full" /> : (
                                <div className="flex items-center gap-1 w-full">
                                    <span className="font-mono text-xs truncate">{account?.walletAddress}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyAddress}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications Card */}
                <Card className="md:col-span-2 shadow-lg bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Bell className="h-7 w-7 text-primary" />
                            <CardTitle className="font-headline text-2xl">Notification Preferences</CardTitle>
                        </div>
                        <CardDescription>
                            Choose what you want to be notified about.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {notificationSettings.map(setting => (
                             <div key={setting.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                <div>
                                    <h4 className="font-semibold">{setting.label}</h4>
                                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                                </div>
                                <Switch id={setting.id} defaultChecked={setting.id !== 'security'} />
                            </div>
                        ))}
                    </CardContent>
                     <CardFooter className="border-t px-6 py-4">
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
