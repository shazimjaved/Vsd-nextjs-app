
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Coins, Video, Link as LinkIcon, ArrowRightLeft, Gift, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from '@/config/site';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, increment, runTransaction } from 'firebase/firestore';
import type { Account } from '@/types/account';

const { CONVERSION_RATE, VSD_PRICE_USD } = siteConfig.tokenValues;
const VSD_LITE_PRICE_USD = VSD_PRICE_USD / CONVERSION_RATE;


interface Advertisement {
    id: string;
    title: string;
    type: 'video' | 'url';
    url: string;
    reward: number;
    status: 'Active' | 'Paused';
    createdAt: string;
    clicks: number;
}

const VideoTaskCard = ({ task, onComplete, completedTasks }: { task: Advertisement, onComplete: (task: Advertisement) => void, completedTasks: string[] }) => {
    const MOCK_VIDEO_DURATION = 10; // seconds
    const [isWatched, setIsWatched] = useState(false);
    const [countdown, setCountdown] = useState(MOCK_VIDEO_DURATION);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!completedTasks.includes(task.id)) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsWatched(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [task.id, completedTasks]);
    
    const isCompleted = completedTasks.includes(task.id);

    return (
        <Card className="flex flex-col shadow-md">
            <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                    <Video className="h-7 w-7 text-primary" />
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                 <div className="aspect-video bg-black rounded-md flex items-center justify-center text-muted-foreground">
                    <p>Mock Video Player</p>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                    <span className="text-muted-foreground">Reward</span>
                    <span className="font-bold text-lg text-yellow-400">+{task.reward} VSD Lite</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" variant="outline" onClick={() => onComplete(task)} disabled={!isWatched || isCompleted}>
                    {isCompleted ? 'Reward Claimed' : isWatched ? 'Claim Reward' : `Claim in ${countdown}s`}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function EarnPage() {
  const { isLoading: isAuthLoading } = useProtectedRoute();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const accountRef = useMemoFirebase(() => user && firestore ? doc(firestore, 'accounts', user.uid) : null, [firestore, user]);
  const { data: account, isLoading: isAccountLoading } = useDoc<Account>(accountRef);

  const [liteToVsdAmount, setLiteToVsdAmount] = useState('');
  const [vsdToLiteAmount, setVsdToLiteAmount] = useState('');
  const [isConvertingLite, setIsConvertingLite] = useState(false);
  const [isConvertingVsd, setIsConvertingVsd] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  const adsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'advertisements') : null, [firestore]);
  const { data: advertisements, isLoading: isAdsLoading } = useCollection<Advertisement>(adsQuery);

  const handleTaskComplete = (task: Advertisement) => {
    if (!firestore || !user || !account) return;
    if (completedTasks.includes(task.id)) {
      toast({
        variant: "destructive",
        title: "Task Already Completed",
        description: "You have already earned rewards for this task.",
      });
      return;
    }
    
    // Non-blocking UI update for ad clicks
    const adRef = doc(firestore, 'advertisements', task.id);
    updateDocumentNonBlocking(adRef, { clicks: increment(1) });
    
    // Non-blocking update for user balance
    const userAccountRef = doc(firestore, 'accounts', user.uid);
    updateDocumentNonBlocking(userAccountRef, { vsdLiteBalance: increment(task.reward) });

    // Non-blocking transaction log creation
    const userTransactionsRef = collection(firestore, 'accounts', user.uid, 'transactions');
    addDocumentNonBlocking(userTransactionsRef, {
        type: 'in VSD Lite',
        status: 'Completed',
        amount: task.reward,
        date: new Date().toISOString(),
        from: 'VSD Network Tasks',
        to: account.displayName,
        description: `Reward for: ${task.title}`
    });

    setCompletedTasks(prev => [...prev, task.id]);
    toast({
      title: "Task Complete!",
      description: `You've earned ${task.reward} VSD Lite tokens!`,
    });
    
    if (task.type === 'url') {
        window.open(task.url, '_blank');
    }
  };

  const handleLiteToVsdConversion = async () => {
    const amount = parseFloat(liteToVsdAmount);
    if (!firestore || !accountRef || !account) return;

    if (isNaN(amount) || amount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive number.' });
      return;
    }
    if (amount > (account?.vsdLiteBalance ?? 0)) {
      toast({ variant: 'destructive', title: 'Insufficient Balance', description: 'You cannot convert more VSD Lite than you have.' });
      return;
    }

    setIsConvertingLite(true);
    
    try {
      const vsdReceived = amount / CONVERSION_RATE;
      await runTransaction(firestore, async (transaction) => {
        transaction.update(accountRef, {
            vsdLiteBalance: increment(-amount),
            vsdBalance: increment(vsdReceived),
        });
      });
      
      // Log both sides of the conversion
      const userTransactionsRef = collection(firestore, 'accounts', account.uid, 'transactions');
      addDocumentNonBlocking(userTransactionsRef, {
          type: 'out VSD Lite',
          status: 'Completed',
          amount: amount,
          date: new Date().toISOString(),
          from: account.walletAddress,
          to: 'VSD Network Treasury',
          description: `Converted to ${vsdReceived.toLocaleString()} VSD`
      });
      addDocumentNonBlocking(userTransactionsRef, {
          type: 'in VSD',
          status: 'Completed',
          amount: vsdReceived,
          date: new Date().toISOString(),
          from: 'VSD Network Treasury',
          to: account.walletAddress,
          description: `Converted from ${amount.toLocaleString()} VSD Lite`
      });

      setLiteToVsdAmount('');
      toast({
        title: "Conversion Successful",
        description: `You converted ${amount.toLocaleString()} VSD Lite to ${vsdReceived.toLocaleString()} VSD.`,
      });
    } catch (e) {
       toast({ variant: 'destructive', title: 'Conversion Failed', description: 'An error occurred during the conversion.' });
    } finally {
        setIsConvertingLite(false);
    }
  };
  
  const handleVsdToLiteConversion = async () => {
    const amount = parseFloat(vsdToLiteAmount);
    if (!firestore || !accountRef || !account) return;
    
    if (isNaN(amount) || amount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive number.' });
        return;
    }
    if (amount > (account?.vsdBalance ?? 0)) {
        toast({ variant: 'destructive', title: 'Insufficient Balance', description: 'You do not have enough VSD to convert.' });
        return;
    }

    setIsConvertingVsd(true);
    
    try {
        const liteReceived = amount * CONVERSION_RATE;
        await runTransaction(firestore, async (transaction) => {
            transaction.update(accountRef, {
                vsdBalance: increment(-amount),
                vsdLiteBalance: increment(liteReceived)
            });
        });
        
        const userTransactionsRef = collection(firestore, 'accounts', account.uid, 'transactions');
         addDocumentNonBlocking(userTransactionsRef, {
            type: 'out VSD',
            status: 'Completed',
            amount: amount,
            date: new Date().toISOString(),
            from: account.walletAddress,
            to: 'VSD Network Treasury',
            description: `Exchanged for ${liteReceived.toLocaleString()} VSD Lite`
        });
        addDocumentNonBlocking(userTransactionsRef, {
            type: 'in VSD Lite',
            status: 'Completed',
            amount: liteReceived,
            date: new Date().toISOString(),
            from: 'VSD Network Treasury',
            to: account.walletAddress,
            description: `Exchanged from ${amount.toLocaleString()} VSD`
        });


        setVsdToLiteAmount('');
        toast({
            title: "Exchange Successful",
            description: `You exchanged ${amount.toLocaleString()} VSD for ${liteReceived.toLocaleString()} VSD Lite.`,
        });
    } catch (e) {
         toast({ variant: 'destructive', title: 'Exchange Failed', description: 'An error occurred during the exchange.' });
    } finally {
        setIsConvertingVsd(false);
    }
  };
  
  const activeAds = advertisements?.filter(ad => ad.status === 'Active');
  
  if (isAuthLoading || isAccountLoading) {
    return (
       <div className="space-y-12 py-8">
        <header className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
        </header>
         <div className="grid md:grid-cols-2 gap-8">
            <Card><Skeleton className="h-48 w-full" /></Card>
            <Card><Skeleton className="h-48 w-full" /></Card>
         </div>
         <Separator />
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card><Skeleton className="h-48 w-full" /></Card>
            <Card><Skeleton className="h-48 w-full" /></Card>
            <Card><Skeleton className="h-48 w-full" /></Card>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <header className="text-center">
        <Gift className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">Earn Your Way In</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          Engage with content from our partners to earn VSD Lite tokens. Your participation helps fund the network and gives you a pathway to convert your earnings into official VSD tokens.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-center p-4 rounded-md bg-muted/50">
                <span className="text-muted-foreground">VSD Lite Balance</span>
                <span className="font-bold text-2xl text-yellow-400">{(account?.vsdLiteBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-md bg-muted/50">
                <span className="text-muted-foreground">Main VSD Balance</span>
                <span className="font-bold text-2xl text-primary">{(account?.vsdBalance ?? 0).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ArrowRightLeft /> Convert VSD Lite to VSD</CardTitle>
            <CardDescription>{CONVERSION_RATE} VSD Lite = 1 VSD (VSD Lite Value: ~${VSD_LITE_PRICE_USD.toExponential(2)})</CardDescription>
          </CardHeader>
          <CardContent>
             <div>
                <label htmlFor="lite-convert-amount" className="text-sm font-medium text-muted-foreground">Amount of VSD Lite</label>
                <Input
                    id="lite-convert-amount"
                    type="number"
                    placeholder={`Max: ${(account?.vsdLiteBalance ?? 0).toLocaleString()}`}
                    value={liteToVsdAmount}
                    onChange={(e) => setLiteToVsdAmount(e.target.value)}
                    className="mt-1"
                />
             </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleLiteToVsdConversion} disabled={isConvertingLite}>
                {isConvertingLite ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                {isConvertingLite ? 'Converting...' : 'Convert Now'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg bg-card/80 backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ArrowRightLeft /> Exchange VSD for VSD Lite</CardTitle>
            <CardDescription>1 VSD = {CONVERSION_RATE} VSD Lite. Use VSD Lite for ad credits or tips.</CardDescription>
          </CardHeader>
          <CardContent>
             <div>
                <label htmlFor="vsd-convert-amount" className="text-sm font-medium text-muted-foreground">Amount of VSD</label>
                <Input
                    id="vsd-convert-amount"
                    type="number"
                    placeholder={`Max: ${(account?.vsdBalance ?? 0).toLocaleString()}`}
                    value={vsdToLiteAmount}
                    onChange={(e) => setVsdToLiteAmount(e.target.value)}
                    className="mt-1"
                />
             </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleVsdToLiteConversion} disabled={isConvertingVsd}>
                {isConvertingVsd ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRightLeft className="h-4 w-4 mr-2" />}
                {isConvertingVsd ? 'Exchanging...' : 'Exchange for VSD Lite'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Separator />

      <section>
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-center mb-8">Complete Tasks to Earn VSD Lite</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isAdsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}><Skeleton className="w-full h-80" /></Card>
                ))
            ) : activeAds && activeAds.length > 0 ? (
                activeAds.map(task => {
                    if (task.type === 'video') {
                        return <VideoTaskCard key={task.id} task={task} onComplete={handleTaskComplete} completedTasks={completedTasks} />;
                    }
                    return (
                        <Card key={task.id} className="flex flex-col shadow-md">
                            <CardHeader>
                                <div className="flex items-center space-x-3 mb-2">
                                   <ExternalLink className="h-7 w-7 text-primary" />
                                   <CardTitle className="text-lg">{task.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                                    <span className="text-muted-foreground">Reward</span>
                                    <span className="font-bold text-lg text-yellow-400">+{task.reward} VSD Lite</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="outline" onClick={() => handleTaskComplete(task)} disabled={completedTasks.includes(task.id)}>
                                    {completedTasks.includes(task.id) ? 'Reward Claimed' : 'Visit & Earn'}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })
            ) : (
                <p className="text-muted-foreground text-center col-span-full">No active campaigns to earn VSD Lite right now. Check back soon!</p>
            )}
        </div>
      </section>

    </div>
  );
}
