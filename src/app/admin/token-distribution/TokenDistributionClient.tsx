'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAdminProxy, adminProxyWrite, adminProxyCreate, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { Account } from '@/types/account';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, ChevronsUpDown, Check, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { doc } from 'firebase/firestore';

const ITEMS_PER_PAGE = 10;

export function TokenDistributionClient() {
    useProtectedRoute({ adminOnly: true });
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [tokenType, setTokenType] = React.useState<'vsd' | 'vsdLite'>('vsdLite');
    const [description, setDescription] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    
    const { user } = useUser();
    const firestore = useFirestore();

    const { data: accountsFromProxy, isLoading: accountsLoading } = useAdminProxy<Account>('accounts');
    const adminAccountRef = useMemoFirebase(() => user && firestore ? doc(firestore, 'accounts', user.uid) : null, [user, firestore]);
    const { data: adminAccount, isLoading: adminAccountLoading } = useDoc<Account>(adminAccountRef);

    const allAccounts = React.useMemo(() => {
        if (!accountsFromProxy) return adminAccount ? [adminAccount] : [];
        const accountsMap = new Map(accountsFromProxy.map(acc => [acc.uid, acc]));
        if (adminAccount) {
            accountsMap.set(adminAccount.uid, adminAccount);
        }
        return Array.from(accountsMap.values());
    }, [accountsFromProxy, adminAccount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
            return;
        }
        if (!selectedUser || !amount || !description) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please select a user and enter an amount and description.' });
            return;
        }

        setIsLoading(true);
        const numericAmount = Number(amount);
        const targetAccount = allAccounts?.find(acc => acc.uid === selectedUser);
        
        if (!targetAccount) {
            toast({ variant: 'destructive', title: 'User Not Found' });
            setIsLoading(false);
            return;
        }

        try {
            const idToken = await user.getIdToken(true);
            const balanceField = tokenType === 'vsd' ? 'vsdBalance' : 'vsdLiteBalance';
            const currentBalance = targetAccount[balanceField] || 0;
            const newBalance = currentBalance + numericAmount;

            await adminProxyWrite(idToken, 'accounts', selectedUser, { [balanceField]: newBalance });
            
            const transactionData = {
                type: 'Airdrop' as const,
                status: 'Completed' as const,
                amount: numericAmount,
                date: new Date().toISOString(),
                accountId: selectedUser,
                description: `Admin Airdrop: ${description}`,
                from: 'VSD Network Treasury',
                to: targetAccount.walletAddress,
                user: targetAccount.displayName,
            };
            await adminProxyCreate(idToken, `accounts/${selectedUser}/transactions`, transactionData);
            
            toast({
                title: 'Airdrop Successful',
                description: `Sent ${numericAmount.toLocaleString()} ${tokenType === 'vsd' ? 'VSD' : 'VSD Lite'} to ${targetAccount.displayName}.`
            });
            
            // Reset form
            setSelectedUser('');
            setAmount('');
            setDescription('');

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Airdrop Failed',
                description: error.message || 'An unknown error occurred.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const filteredAccounts = React.useMemo(() => {
        if (!allAccounts) return [];
        const lowercasedQuery = searchQuery.toLowerCase();
        return allAccounts.filter(account =>
            (account.displayName || '').toLowerCase().includes(lowercasedQuery) ||
            (account.email || '').toLowerCase().includes(lowercasedQuery)
        );
    }, [allAccounts, searchQuery]);

    const paginatedAccounts = React.useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAccounts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAccounts, currentPage]);

    const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);


    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Token Distribution</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Manual Airdrop</CardTitle>
                            <CardDescription>Directly distribute VSD or VSD Lite tokens to a user account. This action is logged.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {accountsLoading || adminAccountLoading ? <Skeleton className="h-40 w-full" /> : (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="user-select">Select User</Label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between"
                                                >
                                                {selectedUser
                                                    ? allAccounts?.find((acc) => acc.uid === selectedUser)?.displayName
                                                    : "Select a user to receive tokens..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search users by name or email..." />
                                                    <CommandList>
                                                        <CommandEmpty>No user found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {allAccounts?.map((acc) => (
                                                            <CommandItem
                                                                key={acc.uid}
                                                                value={`${acc.displayName} ${acc.email}`}
                                                                onSelect={() => {
                                                                    setSelectedUser(acc.uid)
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedUser === acc.uid ? "opacity-100" : "opacity-0"
                                                                )}
                                                                />
                                                                {acc.displayName} ({acc.email})
                                                            </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Amount</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="e.g., 1000"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Token Type</Label>
                                            <RadioGroup onValueChange={(v: 'vsd' | 'vsdLite') => setTokenType(v)} defaultValue={tokenType} className="flex items-center space-x-4 pt-2">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="vsdLite" id="vsdLite" />
                                                    <Label htmlFor="vsdLite">VSD Lite</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="vsd" id="vsd" />
                                                    <Label htmlFor="vsd">VSD</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Reason / Description</Label>
                                        <Input
                                            id="description"
                                            placeholder="e.g., Community reward for bug report"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading || accountsLoading || adminAccountLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Send className="mr-2 h-4 w-4" />
                                Send Airdrop
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>A list of all users on the network.</CardDescription>
                         <div className="relative pt-2">
                            <Search className="absolute left-2.5 top-4.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search users by name or email..."
                                className="w-full rounded-lg bg-background pl-8"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead className="text-right">VSD Balance</TableHead>
                                    <TableHead className="text-right">VSD Lite Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accountsLoading || adminAccountLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : paginatedAccounts.length > 0 ? (
                                    paginatedAccounts.map(account => (
                                        <TableRow key={account.uid}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={account.photoURL ?? undefined} />
                                                        <AvatarFallback>{account.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{account.displayName}</div>
                                                        <div className="text-xs text-muted-foreground">{account.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">{account.vsdBalance.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-mono text-yellow-400">{account.vsdLiteBalance.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
