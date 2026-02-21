
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownLeft, Send, HandCoins, BarChart, FileJson, Copy, PiggyBank, Loader2, Search, Gift, Coins, ChevronsUpDown, Check, Wallet } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useDoc, useCollection, useFirestore, useUser, addDocumentNonBlocking, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc, collection, runTransaction, increment, query, where, getDocs, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import type { Account } from '@/types/account';
import { format, isSameDay, isSameMonth, subDays } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Transaction {
  id: string;
  type: string;
  from?: string;
  to?: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  description: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-background/80 border border-border rounded-lg shadow-lg">
                <p className="label font-bold">{`${label}`}</p>
                <p className="intro text-primary">{`Usage: ${payload[0].value.toLocaleString()} VSD`}</p>
            </div>
        );
    }
    return null;
};

const AnimatedBalanceCard = ({ title, description, value, icon: Icon, isVsdLite = false, isLoading, onCopy, walletAddress }: { title: string, description: string, value: number, icon: React.ElementType, isVsdLite?: boolean, isLoading: boolean, onCopy?: () => void, walletAddress?: string }) => {
    const displayValue = useAnimatedCounter(value);

    return (
        <Card className="bg-card/40 backdrop-blur-sm border border-white/10 shadow-lg">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardDescription>{title}</CardDescription>
                    {isLoading ? (
                        <Skeleton className="h-14 w-64 mt-2" />
                    ) : (
                        <motion.div className={cn("text-4xl md:text-5xl font-bold", isVsdLite && "text-yellow-400")}>
                            {displayValue}
                        </motion.div>
                    )}
                </div>
                <Icon className="h-12 w-12 text-muted-foreground" />
            </CardHeader>
            {walletAddress && (
                <CardContent>
                    <div className="text-xs text-muted-foreground flex items-center">
                        {isLoading ? (
                            <Skeleton className="h-5 w-full" />
                        ) : (
                            <>
                                <span>{walletAddress}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={onCopy}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
};


export function DashboardClient() {
  const { isLoading: isAuthLoading } = useProtectedRoute();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const accountRef = useMemoFirebase(() => user && firestore ? doc(firestore, 'accounts', user.uid) : null, [firestore, user]);
  const transactionsRef = useMemoFirebase(() => user && firestore ? collection(firestore, 'accounts', user.uid, 'transactions') : null, [firestore, user]);

  const { data: account, isLoading: isAccountLoading } = useDoc<Account>(accountRef);
  const { data: transactions, isLoading: areTransactionsLoading } = useCollection<Transaction>(transactionsRef);

  const isLoading = isAuthLoading || isAccountLoading;

    React.useEffect(() => {
        const checkDailyReward = async () => {
            if (!account || !accountRef || !transactionsRef) return;

            const now = new Date();
            const lastStreakDay = account.lastStreakDay ? new Date(account.lastStreakDay) : null;

            // Don't do anything if they already logged in today
            if (lastStreakDay && isSameDay(now, lastStreakDay)) {
                return;
            }

            let currentStreak = account.loginStreak || 0;
            
            // Monthly Reset
            if (lastStreakDay && !isSameMonth(now, lastStreakDay)) {
                currentStreak = 0;
            }

            // Check for consecutive day
            const yesterday = subDays(now, 1);
            if (lastStreakDay && isSameDay(yesterday, lastStreakDay)) {
                currentStreak += 1; // It's a consecutive login
            } else {
                currentStreak = 1; // Not consecutive or first login, start streak at 1
            }

            if (currentStreak > 7) {
                currentStreak = 7; // Cap the streak at 7
            }
            
            const updates: Partial<Account> = {
                loginStreak: currentStreak,
                lastStreakDay: now.toISOString(),
            };

            // Issue reward if streak is 7 days or less
            if (currentStreak <= 7) {
                const dailyReward = 25; // New reward amount
                updates.vsdLiteBalance = increment(dailyReward) as any;

                await updateDocumentNonBlocking(accountRef, updates);
                
                await addDocumentNonBlocking(transactionsRef, {
                    type: 'in VSD Lite',
                    status: 'Completed',
                    amount: dailyReward,
                    date: now.toISOString(),
                    description: `Daily login reward for ${format(now, 'PPP')} (Streak day ${currentStreak})`,
                    from: 'VSD Network',
                    to: account.displayName
                });

                toast({
                    title: `Day ${currentStreak} Bonus!`,
                    description: `You've received ${dailyReward} VSD Lite for your daily login!`,
                });
            } else {
                 // If streak is already > 7, just update the login time without a reward
                 await updateDocumentNonBlocking(accountRef, { lastStreakDay: now.toISOString() });
            }
        };

        // This check should only run once when the account data is first loaded.
        if (account) {
            checkDailyReward();
        }

  }, [account, accountRef, transactionsRef, toast]);


  const handleCopyToClipboard = () => {
    if (account?.walletAddress) {
      navigator.clipboard.writeText(account.walletAddress);
      toast({
        title: "Copied to Clipboard!",
        description: "Your VSD wallet address has been copied.",
      });
    }
  };
  
  const activityData = React.useMemo(() => {
    if (!transactions) return [];
    
    const monthlyUsage = transactions
        .filter(tx => tx.type !== 'in' && tx.status === 'Completed')
        .reduce((acc, tx) => {
            const month = format(new Date(tx.date), 'MMM yyyy');
            acc[month] = (acc[month] || 0) + tx.amount;
            return acc;
        }, {} as Record<string, number>);
        
    return Object.entries(monthlyUsage)
        .map(([month, value]) => ({ month, value }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [transactions]);
  
  const filteredTransactions = React.useMemo(() => {
    if (!transactions) return [];
    const sorted = transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (!searchQuery) return sorted;

    const lowercasedQuery = searchQuery.toLowerCase();
    return sorted.filter(tx => 
        (tx.description && tx.description.toLowerCase().includes(lowercasedQuery)) ||
        (tx.from && tx.from.toLowerCase().includes(lowercasedQuery)) ||
        (tx.to && tx.to.toLowerCase().includes(lowercasedQuery)) ||
        tx.amount.toString().includes(lowercasedQuery)
    );
  }, [transactions, searchQuery]);

  const canSendTokens = (account?.vsdBalance ?? 0) >= 20;

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-2">My Dashboard</h1>
        <p className="text-base sm:text-lg text-muted-foreground">Welcome to your VSD Network banking suite.</p>
      </header>
      
      {/* Independent Media Group Logo - Center */}
      <div className="flex justify-center items-center py-6">
        <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-lg shadow-2xl shadow-primary/10 border border-primary/20 p-4 flex items-center justify-center bg-card/40 backdrop-blur-sm">
          <Image
            src="/img-img-logo.png?v=3"
            alt="Independent Media Group Logo"
            width={200}
            height={200}
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedBalanceCard 
            title="VSD Balance"
            description="Main Network Utility Token"
            value={account?.vsdBalance ?? 0}
            icon={Wallet}
            isLoading={isLoading}
            walletAddress={account?.walletAddress}
            onCopy={handleCopyToClipboard}
          />
           <AnimatedBalanceCard 
            title="VSD Lite Balance"
            description="Earned Reward Points"
            value={account?.vsdLiteBalance ?? 0}
            icon={Gift}
            isVsdLite={true}
            isLoading={isLoading}
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <div className="w-full sm:w-1/2">
                                <SendVsdDialog userAccount={account} />
                             </div>
                        </TooltipTrigger>
                         {!canSendTokens && (
                            <TooltipContent>
                                <p>You need at least 20 VSD to send tokens.</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
              <Button variant="outline" className="btn-hover-effect w-full sm:w-1/2" onClick={() => toast({ title: "Feature Coming Soon", description: "Receiving VSD is active at your wallet address."})}>Receive</Button>
          </div>

          <Card className="bg-card/40 backdrop-blur-sm border border-white/10 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart className="h-6 w-6" />Activity Overview</CardTitle>
              <CardDescription>A live look at your VSD token usage over the last months.</CardDescription>
            </CardHeader>
            <CardContent>
                {areTransactionsLoading ? <Skeleton className="h-[250px] w-full" /> : activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsBarChart data={activityData}>
                      <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--accent))', radius: 'var(--radius)'}} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[250px]">
                        <p className="text-muted-foreground">No transaction data available to display chart.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card/40 backdrop-blur-sm border border-white/10 shadow-lg">
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><PiggyBank className="h-6 w-6" />Staking</CardTitle>
                <CardDescription>Feature on the VSD Network Roadmap.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Staked Amount</span>
                    <span className="font-bold">Coming Soon</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estimated APY</span>
                    <span className="font-bold">TBD</span>
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" disabled>Stake Now (Coming Soon)</Button>
            </CardFooter>
          </Card>
          <Card className="bg-card/40 backdrop-blur-sm border border-white/10 shadow-lg">
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileJson className="h-6 w-6" />My Contracts</CardTitle>
                 <CardDescription>Feature on the VSD Network Roadmap.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-center text-muted-foreground text-sm py-4">Smart contract management is coming soon.</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant="outline" disabled>Create New Contract (Coming Soon)</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Separator />

      <Card className="bg-card/40 backdrop-blur-sm border border-white/10 shadow-lg">
          <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle className="flex items-center gap-2"><Coins className="h-6 w-6" />Recent Transactions</CardTitle>
                <CardDescription>Your latest account activity.</CardDescription>
            </div>
            <div className="relative mt-4 sm:mt-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full sm:w-[200px] lg:w-[300px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From/To</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areTransactionsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                ))
              ) : filteredTransactions && filteredTransactions.length > 0 ? (
                filteredTransactions?.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type.includes('in') ? <ArrowDownLeft className="h-4 w-4 text-green-500"/> : <ArrowUpRight className="h-4 w-4 text-red-500" />}
                      <span className="font-medium">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{tx.type.includes('in') ? tx.from || 'N/A' : tx.to || 'N/A'}</TableCell>
                  <TableCell className="text-muted-foreground">{tx.description}</TableCell>
                  <TableCell className={`text-right font-bold ${tx.type.includes('in') ? 'text-green-400' : ''} ${tx.type.includes('Lite') ? 'text-yellow-400' : ''}`}>
                    {tx.type.includes('in') ? '+' : '-'}{tx.amount.toLocaleString()} {tx.type.includes('Lite') ? 'VSD Lite' : 'VSD'}
                  </TableCell>
                  <TableCell className="text-center">
                     <Badge variant={tx.status === 'Completed' ? 'default' : 'destructive'} className="capitalize">
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))) : (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        {searchQuery ? 'No transactions match your search.' : 'No transactions yet.'}
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SendVsdDialog({ userAccount }: { userAccount: Account | null }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [tokenType, setTokenType] = React.useState('');
    const [recipientId, setRecipientId] = React.useState('');
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<Account[]>([]);
    
    const firestore = useFirestore();
    const { user } = useUser();
    const canSendTokens = (userAccount?.vsdBalance ?? 0) >= 20;

    // Debounce search input
    React.useEffect(() => {
        const handler = setTimeout(async () => {
            if (search.length > 2 && firestore) {
                const searchLower = search.toLowerCase();
                const accountsRef = collection(firestore, 'accounts');
                // Create two separate queries
                const nameQuery = query(accountsRef, where('displayName', '>=', searchLower), where('displayName', '<=', searchLower + '\uf8ff'), limit(5));
                const emailQuery = query(accountsRef, where('email', '==', searchLower), limit(5));

                const [nameSnapshot, emailSnapshot] = await Promise.all([getDocs(nameQuery), getDocs(emailQuery)]);
                
                const resultsMap = new Map<string, Account>();
                nameSnapshot.forEach(doc => resultsMap.set(doc.id, { uid: doc.id, ...doc.data() } as Account));
                emailSnapshot.forEach(doc => resultsMap.set(doc.id, { uid: doc.id, ...doc.data() } as Account));
                                
                const combinedResults = Array.from(resultsMap.values());
                setSearchResults(combinedResults);
            } else {
                setSearchResults([]);
            }
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [search, firestore]);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!userAccount || !firestore || !user) {
            toast({ variant: 'destructive', title: 'Error', description: 'User account not found.' });
            return;
        }

        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        const amount = Number(formData.get('amount'));
        const description = formData.get('description') as string;
        
        const recipientAccount = searchResults.find(acc => acc.uid === recipientId);
        if (!recipientAccount) {
            toast({ variant: 'destructive', title: 'Recipient Not Found', description: 'Please select a valid recipient from the search results.' });
            setIsLoading(false);
            return;
        }
        
        const finalDescription = description || `Transfer to ${recipientAccount.displayName}`;

        if (!recipientId || !amount || amount <= 0 || !tokenType) {
            toast({ variant: 'destructive', title: 'Invalid Input', description: 'Please fill out all fields correctly.' });
            setIsLoading(false);
            return;
        }
        
        const balanceToCheck = tokenType === 'vsd' ? userAccount.vsdBalance : userAccount.vsdLiteBalance;
        const balanceField = tokenType === 'vsd' ? 'vsdBalance' : 'vsdLiteBalance';
        const tokenName = tokenType === 'vsd' ? 'VSD' : 'VSD Lite';
        
        if (amount > balanceToCheck) {
            toast({ variant: 'destructive', title: `Insufficient Balance`, description: `You have an insufficient ${tokenName} balance to complete this transaction.` });
            setIsLoading(false);
            return;
        }

        try {
            await runTransaction(firestore, async (transaction) => {
                const fromRef = doc(firestore, 'accounts', user.uid);
                const toRef = doc(firestore, 'accounts', recipientAccount.uid);

                transaction.update(fromRef, { [balanceField]: increment(-amount) });
                transaction.update(toRef, { [balanceField]: increment(amount) });
            });

            // Log for sender
            const fromTxCollection = collection(firestore, 'accounts', user.uid, 'transactions');
            await addDocumentNonBlocking(fromTxCollection, {
                type: `out ${tokenName}`,
                status: 'Completed',
                amount,
                date: new Date().toISOString(),
                from: userAccount.displayName,
                to: recipientAccount.displayName,
                description: finalDescription
            });
            
            // Log for receiver
            const toTxCollection = collection(firestore, 'accounts', recipientAccount.uid, 'transactions');
            await addDocumentNonBlocking(toTxCollection, {
                type: `in ${tokenName}`,
                status: 'Completed',
                amount,
                date: new Date().toISOString(),
                from: userAccount.displayName,
                to: recipientAccount.displayName,
                description: finalDescription
            });

            // Log for global feed
            const globalTxCollection = collection(firestore, 'transactions');
             await addDocumentNonBlocking(globalTxCollection, {
                type: `Transfer ${tokenName}`,
                status: 'Completed',
                amount,
                date: new Date().toISOString(),
                from: userAccount.displayName,
                to: recipientAccount.displayName,
                description: finalDescription
            });

            toast({
                title: 'Transaction Successful',
                description: `Sent ${amount} ${tokenName} to ${recipientAccount.displayName}.`,
            });
            setIsOpen(false);
            setRecipientId('');
            setSearch('');

        } catch (error: any) {
            console.error("Transaction failed:", error);
            toast({
                variant: 'destructive',
                title: 'Transaction Failed',
                description: error.message || 'An unexpected error occurred while processing the transaction.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="btn-hover-effect w-full" disabled={!canSendTokens}>
                    Send
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Send Tokens</DialogTitle>
                        <DialogDescription>Transfer VSD or VSD Lite to another user on the network.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                             <Label>Token Type</Label>
                             <RadioGroup onValueChange={(value) => setTokenType(value)} required>
                                <div className="flex items-center gap-4">
                                     <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="vsd" id="vsd" />
                                        <Label htmlFor="vsd">VSD</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="vsdLite" id="vsdLite" />
                                        <Label htmlFor="vsdLite">VSD Lite</Label>
                                    </div>
                                </div>
                             </RadioGroup>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="toAddress">Recipient</Label>
                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={popoverOpen}
                                    className="w-full justify-between"
                                    >
                                    {recipientId
                                        ? searchResults.find((acc) => acc.uid === recipientId)?.displayName ?? "Select user..."
                                        : "Select user..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput 
                                            placeholder="Search by name or email..." 
                                            value={search}
                                            onValueChange={setSearch}
                                        />
                                        <CommandList>
                                            {searchResults.length === 0 && search.length > 2 && <CommandEmpty>No user found.</CommandEmpty>}
                                            <CommandGroup>
                                                {searchResults.map((acc) => (
                                                <CommandItem
                                                    key={acc.uid}
                                                    value={`${acc.displayName} ${acc.email}`}
                                                    onSelect={() => {
                                                        setRecipientId(acc.uid)
                                                        setPopoverOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        recipientId === acc.uid ? "opacity-100" : "opacity-0"
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
                         <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" name="amount" type="number" step="any" required />
                             <p className="text-xs text-muted-foreground"> Your balance: {tokenType === 'vsd' 
                                ? `${(userAccount?.vsdBalance ?? 0).toLocaleString()} VSD` 
                                : `${(userAccount?.vsdLiteBalance ?? 0).toLocaleString()} VSD Lite`}</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input id="description" name="description" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading || !tokenType || !recipientId}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Processing...' : `Send ${tokenType ? (tokenType === 'vsd' ? 'VSD' : 'VSD Lite') : ''}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
