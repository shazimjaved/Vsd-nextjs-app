
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, MoreHorizontal, UserCog, Ban, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAdminProxy, adminProxyWrite, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { Account } from '@/types/account';
import { EditUserRolesDialog } from './EditUserRolesDialog';
import { doc } from 'firebase/firestore';


interface AdvertiserApplication {
    id: string;
    userId: string;
    userName: string;
    companyName: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

interface Admin {
    id: string;
    uid: string;
}

const UserRowSkeleton = () => (
    <TableRow>
        <TableCell><div className="flex items-center gap-2"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-32" /></div></TableCell>
        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
        <TableCell className="hidden sm:table-cell text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
    </TableRow>
);

export function UserManagementClient() {
    useProtectedRoute({ adminOnly: true });
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const { data: accountsFromProxy, isLoading: accountsLoading, error: accountsError } = useAdminProxy<Account>('accounts');
    const { data: applications, isLoading: applicationsLoading, error: applicationsError } = useAdminProxy<AdvertiserApplication>('advertiserApplications');
    const { data: admins, isLoading: adminsLoading, error: adminsError } = useAdminProxy<Admin>('admins');
    
    // Fetch the admin's own account data to ensure it's in the list
    const adminAccountRef = useMemoFirebase(() => user && firestore ? doc(firestore, 'accounts', user.uid) : null, [user, firestore]);
    const { data: adminAccount, isLoading: adminAccountLoading } = useDoc<Account>(adminAccountRef);

    const [editingUser, setEditingUser] = React.useState<Account | null>(null);

    const allAccounts = React.useMemo(() => {
        if (!accountsFromProxy) return adminAccount ? [adminAccount] : [];
        const accountsMap = new Map(accountsFromProxy.map(acc => [acc.uid, acc]));
        if (adminAccount) {
            accountsMap.set(adminAccount.uid, adminAccount);
        }
        return Array.from(accountsMap.values());
    }, [accountsFromProxy, adminAccount]);

    const allUIDs = React.useMemo(() => {
        const uids = new Set<string>();
        allAccounts.forEach(acc => uids.add(acc.uid));
        admins?.forEach(admin => uids.add(admin.id));
        return Array.from(uids);
    }, [allAccounts, admins]);

    const pendingApplications = React.useMemo(() => {
        return applications?.filter(app => app.status === 'pending') || [];
    }, [applications]);

    const handleCopyUid = (uid: string) => {
        navigator.clipboard.writeText(uid);
        toast({ title: 'UID Copied', description: uid });
    };
    
    const handleApplication = async (application: AdvertiserApplication, newStatus: 'approved' | 'rejected') => {
        if (!user) return;
        try {
            const idToken = await user.getIdToken(true);
            // Update the application status
            await adminProxyWrite(idToken, 'advertiserApplications', application.id, { status: newStatus });

            if (newStatus === 'approved') {
                const userDoc = allAccounts?.find(acc => acc.uid === application.userId);
                if (userDoc && !userDoc.roles.includes('advertiser')) {
                    const updatedRoles = [...userDoc.roles, 'advertiser'];
                    await adminProxyWrite(idToken, 'accounts', application.userId, { roles: updatedRoles });
                }
            }

            toast({
                title: `Application ${newStatus}`,
                description: `${application.userName}'s application has been ${newStatus}.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message || 'An error occurred.',
            });
        }
    };
    
    const handleToggleSuspend = async (account: Account) => {
        if (!user) return;
        const newStatus = account.status === 'Active' ? 'Suspended' : 'Active';
        try {
            const idToken = await user.getIdToken(true);
            await adminProxyWrite(idToken, 'accounts', account.uid, { status: newStatus });
            toast({
                title: `User ${newStatus}`,
                description: `${account.displayName} has been ${newStatus.toLowerCase()}.`,
            });
        } catch (e: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: e.message || 'Could not update user status.',
            });
        }
    };


    return (
        <>
            {editingUser && (
                <EditUserRolesDialog
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                />
            )}
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Advertiser Applications</CardTitle>
                    <CardDescription>Review and approve applications from users wishing to become advertisers.</CardDescription>
                </CardHeader>
                <CardContent>
                    {applicationsError && <p className="text-destructive">Error: {applicationsError}</p>}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicationsLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                                </TableRow>
                            ) : pendingApplications.length > 0 ? (
                                pendingApplications.map(app => (
                                    <TableRow key={app.id}>
                                        <TableCell>{app.userName}</TableCell>
                                        <TableCell>{app.companyName}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                                            {format(new Date(app.submittedAt), 'PPp')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-400" onClick={() => handleApplication(app, 'approved')}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400" onClick={() => handleApplication(app, 'rejected')}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No pending applications.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>All Network Users</CardTitle>
                    <CardDescription>View, search, and manage all user accounts in the ecosystem.</CardDescription>
                </CardHeader>
                <CardContent>
                   {accountsError && <p className="text-destructive">Error: {accountsError}</p>}
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead className="hidden sm:table-cell text-right">VSD Balance</TableHead>
                                <TableHead className="text-right">VSD Lite</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accountsLoading || adminAccountLoading ? (
                                Array.from({length: 5}).map((_, i) => <UserRowSkeleton key={i} />)
                            ) : allAccounts && allAccounts.length > 0 ? (
                                allAccounts.map((account) => (
                                    <TableRow key={account.uid}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={account.photoURL ?? undefined} />
                                                    <AvatarFallback>{account.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{account.displayName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">{account.email}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                            {account.roles?.map(role => (
                                                <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>{role}</Badge>
                                            ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-right font-mono">{account.vsdBalance.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-yellow-400">{account.vsdLiteBalance.toLocaleString()}</TableCell>
                                         <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setEditingUser(account)}>
                                                        <UserCog className="mr-2 h-4 w-4"/>Edit Roles
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleSuspend(account)} className={account.status === 'Active' ? 'text-destructive focus:text-destructive' : ''}>
                                                        <Ban className="mr-2 h-4 w-4"/>{account.status === 'Active' ? 'Suspend User' : 'Unsuspend User'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No users found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                   </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Unique User IDs (UIDs)</CardTitle>
                    <CardDescription>A complete list of all unique UIDs from both accounts and admin collections.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(accountsLoading || adminsLoading) && <p>Loading UIDs...</p>}
                    {(accountsError || adminsError) && <p className="text-destructive">Error loading UIDs: {accountsError || adminsError}</p>}
                    {!accountsLoading && !adminsLoading && (
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {allUIDs.map(uid => (
                                <div key={uid} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                    <span className="font-mono text-xs">{uid}</span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopyUid(uid)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

    