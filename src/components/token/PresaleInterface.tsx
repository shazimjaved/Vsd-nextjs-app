
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Gift, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { parseEther } from "ethers";
import { useWeb3 } from '../providers/Web3Provider';


const VSD_PRICE_USD = 0.01; // This would ideally come from a config or API
const MOCK_ETH_PRICE_USD = 3000; // Mock price for demonstration

const TokenomicsDetail = ({ title, value, description }: { title: string, value: string, description?: string }) => (
  <div>
    <h4 className="text-md sm:text-lg font-semibold text-primary">{title}</h4>
    <p className="text-lg sm:text-xl font-bold">{value}</p>
    {description && <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>}
  </div>
);

export const PresaleInterface = () => {
  const { account, signer, connectWallet, disconnectWallet, isLoading: isConnecting } = useWeb3();
  const { toast } = useToast();
  const [contributionAmount, setContributionAmount] = React.useState('');
  const [currency, setCurrency] = React.useState('ETH');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const vsdToReceive = React.useMemo(() => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return 0;
    const usdValue = amount * MOCK_ETH_PRICE_USD; // Assuming ETH for now
    return usdValue / VSD_PRICE_USD;
  }, [contributionAmount]);


  const handleContribute = async () => {
    if (!signer || !account) {
        toast({ variant: "destructive", title: "Wallet not connected" });
        return;
    }
    
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
        toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid contribution amount." });
        return;
    }

    setIsSubmitting(true);
    toast({ title: 'Preparing Transaction...', description: 'Please check your wallet to confirm.' });

    try {
        const tx = {
            to: "0xPRESALE_CONTRACT_ADDRESS", // Replace with your actual contract address
            value: parseEther(contributionAmount),
        };
        
        console.log("Simulating transaction:", tx);
        
        // const response = await signer.sendTransaction(tx);
        // await response.wait();
        // For simulation purposes:
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
            title: "Transaction Submitted (Simulated)",
            description: `Your contribution of ${contributionAmount} ${currency} has been submitted.`,
        });

    } catch (error: any) {
        console.error("Contribution failed:", error);
        toast({
            variant: "destructive",
            title: "Transaction Failed",
            description: error?.reason || error?.message || "An unknown error occurred.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };


  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  return (
    <Card className="shadow-xl bg-gradient-to-br from-primary/20 via-card/90 to-secondary/20 backdrop-blur-xl animated-border">
      <CardHeader className="items-center">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="h-10 w-10 text-primary" />
          <CardTitle className="font-headline text-2xl sm:text-3xl text-primary">Participate in the VSD Token Presale</CardTitle>
        </div>
        <CardDescription className="text-base sm:text-lg text-center max-w-xl">
          Acquire VSD tokens at an exclusive rate to support the ecosystem and be among the first to access exclusive AI tools like IMG Services.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-1 gap-6 items-center">
          <div className="space-y-4 text-center md:text-left">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <TokenomicsDetail title="Current Presale Phase" value="Phase 1 (Public)" description="Limited tokens available at this price." />
                <TokenomicsDetail title="Price per VSD" value="$0.01 USD" description="Equivalent in ETH/USDT." />
                <TokenomicsDetail title="Target Raise (Phase 1)" value="$500,000 USD" />
                <TokenomicsDetail title="Accepted Currencies" value="ETH, USDT" />
            </div>
          </div>

          <Card className="p-6 bg-background/70 space-y-4 w-full">
            <h4 className="font-semibold text-lg text-center">Contribute & Get VSD</h4>
            <>
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">Contribution Amount</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="number"
                    id="amount"
                    placeholder="e.g., 0.5"
                    className="text-base"
                    disabled={!account}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                  />
                  <Tabs value={currency} onValueChange={setCurrency} className="w-[100px]">
                    <TabsList className="grid w-full grid-cols-2 h-10">
                      <TabsTrigger value="ETH" className="text-xs px-2">ETH</TabsTrigger>
                      <TabsTrigger value="USDT" className="text-xs px-2">USDT</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-md text-center">
                <p className="text-sm text-muted-foreground">You will receive (approx.):</p>
                <p className="text-xl font-bold text-primary">
                  {vsdToReceive.toLocaleString()} VSD
                </p>
              </div>
              {account ? (
                <div className="space-y-2">
                    <p className="text-center text-sm text-muted-foreground">Connected: <span className="font-mono text-green-400">{truncateAddress(account)}</span></p>
                    <Button 
                      size="lg" 
                      className="w-full font-bold text-lg py-6 btn-hover-effect" 
                      onClick={handleContribute}
                      disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        ) : (
                             <Wallet className="mr-2 h-6 w-6" />
                        )}
                        {isSubmitting ? 'Processing...' : 'Contribute Now'}
                    </Button>
                    <Button variant="link" className="w-full" onClick={disconnectWallet}>Disconnect Wallet</Button>
                </div>
              ) : (
                <Button
                    size="lg"
                    className="w-full font-bold text-lg py-6 btn-hover-effect"
                    onClick={connectWallet}
                    disabled={isConnecting}
                >
                    {isConnecting ? (
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    ) : (
                        <Wallet className="mr-2 h-6 w-6" />
                    )}
                    {isConnecting ? 'Connecting...' : 'Connect Wallet to Participate'}
                </Button>
              )}
              <p className="text-xs text-muted-foreground text-center">
                By contributing, you agree to the <Link href="/developers/documentation#legal" className="underline hover:text-primary">Terms & Conditions</Link> and acknowledge the risks.
              </p>
            </>
          </Card>
        </div>

        <Separator className="my-6" />

        <div>
            <h4 className="text-lg sm:text-xl font-semibold text-center mb-4">How to Participate - Step-by-Step:</h4>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                <li><strong>Prepare Your Wallet:</strong> Ensure you have a compatible Web3 wallet (e.g., MetaMask, Trust Wallet) funded with ETH or USDT.</li>
                <li><strong>Connect Your Wallet:</strong> Click the "Connect Wallet" button on our official presale platform.</li>
                <li><strong>Complete KYC/AML:</strong> In a real presale, you would be guided through a secure KYC/AML verification process. This is mandatory for participation.</li>
                <li><strong>Enter Contribution Amount:</strong> Specify how much ETH or USDT you wish to contribute. The equivalent VSD token amount will be displayed.</li>
                <li><strong>Confirm Transaction:</strong> Review the details and confirm the transaction in your wallet.</li>
                <li><strong>Receive VSD Tokens:</strong> Your VSD tokens will be allocated to your wallet according to the presale vesting schedule after the TGE (Token Generation Event).</li>
            </ol>
            <p className="text-center text-muted-foreground text-xs mt-4">
              Always ensure you are on the official VSD Network website. Beware of scams.
            </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-center space-y-2">
        <p className="text-sm text-muted-foreground">Presale Platform Link: (Coming Soon - Monitor Official Channels)</p>
        <Button variant="outline" asChild>
            <Link href="/developers/documentation#presale">
                Read Full Presale Details in Whitepaper <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
