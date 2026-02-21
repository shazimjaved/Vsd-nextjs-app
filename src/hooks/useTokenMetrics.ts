
'use client';

import { useState, useEffect } from "react";
import { useAdminProxy } from "@/firebase";
import type { Account } from "@/types/account";

export function useTokenMetrics() {
  // Add the reset_balances option to the hook call
  const { data: accounts, isLoading: isAccountsLoading } = useAdminProxy<Account>('accounts', { reset_balances: true });
  
  const [metrics, setMetrics] = useState({
    totalSupply: 700_000_000,
    circulatingVSD: 0,
    treasuryVSD: 700_000_000,
    circulatingVSDLite: 0,
    loading: true,
  });

  const [airdropPreview, setAirdropPreview] = useState<{[uid: string]: number}>({});

  useEffect(() => {
    if (isAccountsLoading || !accounts) {
      if (!metrics.loading) {
        setMetrics(prev => ({ ...prev, loading: true }));
      }
      return;
    }

    let circulatingVSD = 0;
    let circulatingVSDLite = 0;

    accounts.forEach(account => {
      circulatingVSD += account.vsdBalance || 0;
      circulatingVSDLite += account.vsdLiteBalance || 0;
    });

    const treasuryVSD = metrics.totalSupply - circulatingVSD;

    setMetrics(prev => ({
      ...prev,
      circulatingVSD,
      treasuryVSD,
      circulatingVSDLite,
      loading: false,
    }));

  }, [accounts, isAccountsLoading, metrics.totalSupply, metrics.loading]);

  const simulateAirdrop = (distribution: {[uid: string]: number}) => {
    let totalDistributed = 0;
    const preview: {[uid: string]: number} = {};

    for (const uid in distribution) {
      preview[uid] = distribution[uid];
      totalDistributed += distribution[uid];
    }

    setAirdropPreview(preview);

    return totalDistributed <= metrics.treasuryVSD
      ? `Airdrop of ${totalDistributed.toLocaleString()} VSD is valid.`
      : `Airdrop exceeds treasury! Max available: ${metrics.treasuryVSD.toLocaleString()}`;
  };

  return { metrics, airdropPreview, simulateAirdrop };
}
