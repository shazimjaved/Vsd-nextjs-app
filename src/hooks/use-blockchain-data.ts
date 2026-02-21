
'use client';

import { useState, useEffect } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { siteConfig } from '@/config/site';
import type { Account } from '@/types/account';

interface BlockchainData {
  totalSupply: string;
  holders: number;
  totalTransfers: number;
}

interface Leaderboard {
    updatedAt: string;
    topHolders: Account[];
}

export function useBlockchainData() {
  const [data, setData] = useState<Partial<BlockchainData>>({
    totalSupply: siteConfig.tokenValues.TOTAL_SUPPLY.toString(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const firestore = useFirestore();

  const leaderboardDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'leaderboards', 'topHolders') : null, [firestore]);
  const { data: leaderboard, isLoading: isLeaderboardLoading, error: leaderboardError } = useDoc<Leaderboard>(leaderboardDocRef);


  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate fetching more complex data like total transfers
    const fetchSimulatedData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (leaderboardError) {
          throw leaderboardError;
        }

        const holderCount = leaderboard?.topHolders?.length ?? 0;
        // Simulate a transfer count based on holders
        const simulatedTransfers = holderCount > 0 ? holderCount * 3 + 57 : 0;

        setData({
          totalSupply: siteConfig.tokenValues.TOTAL_SUPPLY.toString(),
          holders: holderCount,
          totalTransfers: simulatedTransfers,
        });

      } catch (err: any) {
        console.error("useBlockchainData Error:", err);
        setError("Could not load on-chain data. The network may be busy.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSimulatedData();

  }, [firestore, leaderboard, isLeaderboardLoading, leaderboardError]);

  return { data, isLoading, error };
}
