
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Music, ImageIcon, Send, FileText } from 'lucide-react';
import { AIImage } from '@/components/ai/AIImage';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, runTransaction, increment } from 'firebase/firestore';
import type { Account } from '@/types/account';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Skeleton } from '@/components/ui/skeleton';

interface Advertisement {
    id: string;
    title: string;
    url: string;
    reward: number; // For demo purposes, we'll treat 'reward' as the 'price' in VSD.
}

const MOCK_ARTIST_UID = "eiMBgcJ3KhWGesl8J78oYFHiquy2"; // VSD Network House Artist Account

export default function AudioExchangePage() {
  useProtectedRoute();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const accountRef = useMemoFirebase(() => user && firestore ? doc(firestore, 'accounts', user.uid) : null, [firestore, user]);
  const { data: account, isLoading: isAccountLoading } = useDoc<Account>(accountRef);
  
  const adsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'advertisements') : null, [firestore]);
  const { data: tracks, isLoading: isLoadingTracks } = useCollection<Advertisement>(adsQuery);

  const handlePurchase = async (track: Advertisement) => {
    setIsLoading(track.id);
    
    if (!account || !accountRef || !user || !firestore) {
      toast({ variant: "destructive", title: "Wallet Not Found", description: "Your account could not be found. Please ensure you are logged in." });
      setIsLoading(null);
      return;
    }

    if (account.vsdBalance < track.reward) {
        toast({ variant: "destructive", title: "Insufficient VSD Balance", description: "You do not have enough VSD to complete this purchase." });
        setIsLoading(null);
        return;
    }
    
    try {
      toast({
        title: "Processing Transaction...",
        description: `Transferring ${track.reward} VSD from your wallet.`,
      });

      const artistAccountRef = doc(firestore, 'accounts', MOCK_ARTIST_UID);

      await runTransaction(firestore, async (transaction) => {
        // Debit the buyer's account
        transaction.update(accountRef, { vsdBalance: increment(-track.reward) });
        // Credit the artist's account (assuming it exists)
        transaction.update(artistAccountRef, { vsdBalance: increment(track.reward) });
      });

      const purchaseDescription = `Purchase of audio license: ${track.title}`;
      
      // Add transaction log for the buyer
      const buyerTxRef = collection(firestore, 'accounts', user.uid, 'transactions');
      await addDocumentNonBlocking(buyerTxRef, {
        type: 'out VSD',
        amount: track.reward,
        status: 'Completed',
        date: new Date().toISOString(),
        description: purchaseDescription,
        to: 'VSD House Artist',
      });

      // Add transaction log for the artist
      const artistTxRef = collection(firestore, 'accounts', MOCK_ARTIST_UID, 'transactions');
       await addDocumentNonBlocking(artistTxRef, {
        type: 'in VSD',
        amount: track.reward,
        status: 'Completed',
        date: new Date().toISOString(),
        description: purchaseDescription,
        from: account.displayName,
      });

      toast({
        title: "Transaction Confirmed",
        description: `Your purchase of "${track.title}" is complete.`,
      });
      
    } catch (error: any) {
        console.error("Purchase failed:", error);
        toast({
            variant: "destructive",
            title: "Purchase Failed",
            description: error.message || "An unknown error occurred during the purchase process.",
        });
    } finally {
        setIsLoading(null);
    }
  };

  const isPageLoading = isLoadingTracks || isAccountLoading;

  return (
    <div className="space-y-12 py-8">
      <header className="text-center">
        <Music className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">VSD Network in Action</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          This page is a live proof-of-concept demonstrating how a partner project, the "Audio Exchange," integrates with the VSD Network. It showcases using VSD tokens for payments via live Firestore transactions.
        </p>
      </header>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {isPageLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex flex-col shadow-lg bg-card/80 backdrop-blur-sm">
              <Skeleton className="w-full h-[450px]" />
            </Card>
          ))
        ) : tracks && tracks.length > 0 ? (
          tracks.map(track => (
            <Card key={track.id} className="flex flex-col shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                 <div className="aspect-video relative mb-4">
                   <AIImage
                      initialSrc={`https://picsum.photos/seed/${encodeURIComponent(track.title)}/600/400`}
                      alt={`Cover art for ${track.title}`}
                      width={600}
                      height={400}
                      className="rounded-t-lg object-cover"
                      hint={`music album cover ${track.title}`}
                      fill
                      style={{ objectFit: 'cover' }}
                   />
                   <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      <ImageIcon className="h-3 w-3" />
                      <span>AI Album Art</span>
                   </div>
                 </div>
                <CardTitle className="font-headline text-xl sm:text-2xl">{track.title}</CardTitle>
                <CardDescription>By VSD House Artist</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-bold text-xl text-primary">{track.reward} VSD</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 pt-2">
                      <FileText className="h-4 w-4" />
                      <span>Purchase creates a real transaction on the VSD Network ledger.</span>
                  </p>
              </CardContent>
              <CardFooter>
                 <Button 
                  className="w-full btn-hover-effect" 
                  onClick={() => handlePurchase(track)}
                  disabled={!!isLoading || !account}
                 >
                  {isLoading === track.id ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Buy with {track.reward} VSD
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
           <p className="text-muted-foreground col-span-full text-center">No tracks available for purchase.</p>
        )}
      </div>
    </div>
  );
}
