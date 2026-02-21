
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Database, Users, ArrowRightLeft, Copy, Check, ArrowUpRightSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useBlockchainData } from "@/hooks/use-blockchain-data";

const tokenData = {
  contractAddress: "0xA37CDC5CE42333A4F57776A4cD93f434E59AB243",
  etherscanUrl: "https://etherscan.io/token/0xA37CDC5CE42333A4F57776A4cD93f434E59AB243",
};

const DataCard = ({ icon: Icon, title, value, isLoading }: { icon: React.ElementType, title: string, value: string | number, isLoading?: boolean }) => (
  <div className="flex flex-col items-center text-center p-4">
    <Icon className="h-8 w-8 text-primary mb-3" />
    <p className="text-sm text-muted-foreground">{title}</p>
    {isLoading ? <Skeleton className="h-7 w-20 mt-1" /> : (
        <p className="font-headline text-xl sm:text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    )}
  </div>
);


export function LiveTokenData({ onOpenModal }: { onOpenModal: () => void }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const { data: blockchainData, isLoading: isLoadingBlockchain, error: blockchainError } = useBlockchainData();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    navigator.clipboard.writeText(tokenData.contractAddress);
    setCopied(true);
    toast({
      title: "Address Copied!",
      description: "VSD contract address copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 md:py-20">
        <Card 
            onClick={onOpenModal}
            className="max-w-4xl mx-auto shadow-2xl shadow-primary/10 bg-card/70 backdrop-blur-sm animated-border cursor-pointer hover:shadow-primary/20 transition-shadow duration-300"
        >
        <CardHeader className="items-center text-center">
          <CardTitle className="font-headline text-2xl sm:text-3xl">Official VSD Token Data</CardTitle>
          <p className="text-muted-foreground max-w-2xl">
            Live on-chain data for the official VSD utility token. Click to view details.
          </p>
        </CardHeader>
        <CardContent>
          {blockchainError && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-md border border-amber-500/50 bg-amber-500/10 text-amber-400">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{blockchainError}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
            <DataCard 
              icon={Database} 
              title="Total Supply" 
              value={blockchainData.totalSupply ? Number(blockchainData.totalSupply).toLocaleString() : '--'} 
              isLoading={isLoadingBlockchain} 
            />
            <DataCard 
              icon={Users} 
              title="Total Holders" 
              value={blockchainData.holders ?? '--'} 
              isLoading={isLoadingBlockchain}
            />
             <DataCard 
              icon={ArrowRightLeft} 
              title="Total Transfers" 
              value={blockchainData.totalTransfers ?? '--'} 
              isLoading={isLoadingBlockchain}
            />
          </div>
          <Separator className="my-6" />
          <div className="text-center space-y-4">
            <h4 className="font-semibold text-muted-foreground">Contract Address</h4>
            <div className="flex items-center justify-center bg-muted/50 p-3 rounded-lg max-w-md mx-auto">
              <p className="font-mono text-xs sm:text-sm truncate">
                {tokenData.contractAddress}
              </p>
              <Button variant="ghost" size="icon" className="ml-2 h-8 w-8" onClick={handleCopy}>
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
             <Button asChild variant="outline" onClick={(e) => e.stopPropagation()}>
              <Link href={tokenData.etherscanUrl} target="_blank" rel="noopener noreferrer">
                View on Etherscan <ArrowUpRightSquare className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
