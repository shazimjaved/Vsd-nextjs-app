
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, ShoppingCart, Loader2 } from 'lucide-react';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Skeleton } from '@/components/ui/skeleton';

const buyVsdSchema = z.object({
  vsdAmount: z.coerce.number().min(100, "Minimum purchase is 100 VSD.").max(100000, "Maximum purchase is 100,000 VSD."),
});

type BuyVsdFormValues = z.infer<typeof buyVsdSchema>;

export default function BuyVsdPage() {
  const { isLoading: isAuthLoading } = useProtectedRoute();
  const { toast } = useToast();

  const form = useForm<BuyVsdFormValues>({
    resolver: zodResolver(buyVsdSchema),
    defaultValues: {
      vsdAmount: 1000,
    },
  });

  const vsdAmount = form.watch('vsdAmount');
  const VSD_PRICE_USD = 0.01;
  const usdAmount = (vsdAmount || 0) * VSD_PRICE_USD;
  
  if (isAuthLoading) {
     return (
      <div className="space-y-12 py-8">
        <header className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
        </header>
        <Card className="max-w-md mx-auto">
            <Skeleton className="h-[450px] w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <header className="text-center">
        <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">Buy VSD Tokens with Card</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          Instantly purchase VSD utility tokens using your credit or debit card, powered by Stripe.
        </p>
      </header>

      <Card className="max-w-md mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
        <Form {...form}>
          <form>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Purchase VSD</CardTitle>
              <CardDescription>Enter the amount of VSD you wish to buy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="vsdAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VSD Token Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center p-4 rounded-md bg-muted/50">
                <span className="text-muted-foreground">You Pay (USD)</span>
                <span className="font-bold text-2xl text-primary">
                  ${usdAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                This is a demonstration. Real transactions via Stripe are coming soon. Your card will not be charged.
              </p>
            </CardContent>
            <CardFooter>
              <Button type="button" disabled={true} size="lg" className="w-full font-bold">
                <CreditCard className="mr-2 h-5 w-5" />
                Stripe Integration Coming Soon
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
