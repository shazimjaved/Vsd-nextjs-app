'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Copy, Check, Trash2, Power, PowerOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CreateTenantDialog } from './CreateTenantDialog';
import { useAdminProxy, adminProxyWrite, adminProxyDelete, useUser } from '@/firebase';
import type { Tenant } from '@/types/tenant';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const TenantRowSkeleton = () => (
    <TableRow>
        <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
        <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
    </TableRow>
)

export function ApiManagementClient() {
    useProtectedRoute({ adminOnly: true });
    const { toast } = useToast();
    const { user } = useUser();
    const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

    const { data: tenants, isLoading, error } = useAdminProxy<Tenant>('tenants');

    const handleCopy = (apiKey: string) => {
        navigator.clipboard.writeText(apiKey);
        setCopiedKey(apiKey);
        toast({ title: "API Key Copied!" });
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleToggleStatus = async (tenant: Tenant) => {
        if (!user) return;
        const newStatus = tenant.status === 'Active' ? 'Inactive' : 'Active';
        try {
            const idToken = await user.getIdToken(true);
            await adminProxyWrite(idToken, 'tenants', tenant.id, { status: newStatus });
            toast({
                title: 'Tenant Status Updated',
                description: `${tenant.name} is now ${newStatus}.`,
            });
            // Note: Data will refresh automatically via useAdminProxy re-fetch.
            // A more advanced implementation might use optimistic updates.
        } catch (e: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: e.message || 'Could not update tenant status.',
            });
        }
    };

    const handleDelete = async (tenant: Tenant) => {
        if (!user) return;
        try {
            const idToken = await user.getIdToken(true);
            await adminProxyDelete(idToken, 'tenants', tenant.id);
            toast({
                title: 'Tenant Deleted',
                description: `${tenant.name} has been permanently deleted.`,
            });
        } catch (e: any) {
             toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: e.message || 'Could not delete tenant.',
            });
        }
    };


    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">API Management</h1>
                <CreateTenantDialog />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Connected Tenants</CardTitle>
                    <CardDescription>Manage API keys and access for integrated partner applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-destructive">Error: {error}</p>}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden md:table-cell">API Key</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden sm:table-cell">Created</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({length: 3}).map((_, i) => <TenantRowSkeleton key={i} />)
                            ) : tenants && tenants.length > 0 ? (
                                tenants.map((tenant) => (
                                <TableRow key={tenant.id}>
                                    <TableCell className="font-medium">{tenant.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-muted-foreground">{tenant.apiKey.substring(0, 12)}...</span>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(tenant.apiKey)}>
                                                {copiedKey === tenant.apiKey ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={tenant.status === 'Active' ? 'default' : 'secondary'}>{tenant.status}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{formatDistanceToNow(new Date(tenant.createdAt), { addSuffix: true })}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleCopy(tenant.apiKey)}>
                                                    <Copy className="mr-2 h-4 w-4" /> Copy API Key
                                                </DropdownMenuItem>
                                                 <DropdownMenuItem onClick={() => handleToggleStatus(tenant)}>
                                                    {tenant.status === 'Active' ? <PowerOff className="mr-2 h-4 w-4"/> : <Power className="mr-2 h-4 w-4" />}
                                                    {tenant.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the tenant "{tenant.name}" and revoke its API key.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(tenant)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No tenants found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
