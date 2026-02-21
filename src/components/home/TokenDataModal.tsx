
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useBlockchainData } from "@/hooks/use-blockchain-data";
import { Skeleton } from "../ui/skeleton";
import { Database, Users, ArrowRightLeft, Copy, Check, ArrowUpRightSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Link from "next/link";
import { Separator } from "../ui/separator";

interface TokenDataModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const tokenData = {
  contractAddress: "0xA37CDC5CE42333A4F57776A4cD93f434E59AB243",
  etherscanUrl: "https://etherscan.io/token/0xA37CDC5CE42333A4F57776A4cD93f434E59AB243",
};

const DataRow = ({ icon: Icon, title, value, isLoading }: { icon: React.ElementType, title: string, value: string | number, isLoading?: boolean }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <span className="font-medium text-muted-foreground">{title}</span>
        </div>
        {isLoading ? <Skeleton className="h-6 w-24" /> : (
            <span className="font-bold text-lg font-mono">{typeof value === 'number' ? value.toLocaleString() : value}</span>
        )}
    </div>
);


export function TokenDataModal({ isOpen, setIsOpen }: TokenDataModalProps) {
  const { data: blockchainData, isLoading: isLoadingBlockchain } = useBlockchainData();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenData.contractAddress);
    setCopied(true);
    toast({
      title: "Address Copied!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px] bg-card/80 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Live Token Data</DialogTitle>
          <DialogDescription>
            A real-time snapshot of the VSD utility token's on-chain metrics.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <DataRow 
                icon={Database}
                title="Total Supply"
                value={blockchainData.totalSupply ? Number(blockchainData.totalSupply).toLocaleString() : '--'}
                isLoading={isLoadingBlockchain}
            />
             <DataRow 
                icon={Users}
                title="Total Holders"
                value={blockchainData.holders ?? '--'}
                isLoading={isLoadingBlockchain}
            />
             <DataRow 
                icon={ArrowRightLeft}
                title="Total Transfers"
                value={blockchainData.totalTransfers ?? '--'}
                isLoading={isLoadingBlockchain}
            />
        </div>
        <Separator />
        <div className="space-y-3">
            <h4 className="font-semibold text-muted-foreground text-sm">Contract Address</h4>
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <p className="font-mono text-xs sm:text-sm truncate">
                {tokenData.contractAddress}
              </p>
              <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 shrink-0" onClick={handleCopy}>
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={tokenData.etherscanUrl} target="_blank" rel="noopener noreferrer">
                View on Etherscan <ArrowUpRightSquare className="ml-2 h-4 w-4" />
              </Link>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
