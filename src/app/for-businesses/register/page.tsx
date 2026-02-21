
import type { Metadata } from 'next';
import { AdvertiserRegistrationClient } from './AdvertiserRegistrationClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Cpu, Gift, ListChecks, Send, KeyRound } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Advertiser & API Registration | VSD Network',
  description: 'Apply to become an advertiser or register for API access on the VSD Network to reach our community of creators and innovators.',
};

const StepCard = ({ icon: Icon, title, step, children }: { icon: React.ElementType, title: string, step: number, children: React.ReactNode }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-4">
            <div>
                <div className="flex items-center justify-center w-10 h-10 border rounded-full border-primary text-primary font-bold">
                    {step}
                </div>
            </div>
            <div className="w-px h-full bg-primary/30"></div>
        </div>
        <div className="pb-8">
            <div className="flex items-center gap-3 mb-2">
                <Icon className="h-5 w-5 text-primary" />
                <p className="text-lg font-semibold font-headline">{title}</p>
            </div>
            <p className="text-muted-foreground">{children}</p>
        </div>
    </div>
);


export default function AdvertiserRegistrationPage() {
  return (
    <>
        <AdvertiserRegistrationClient />
        <Separator className="my-12" />
        <section className="max-w-4xl mx-auto">
            <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-center mb-8">How It Works: A Powerful, Simple Loop</h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Card className="bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gift className="h-6 w-6"/>The User Experience</CardTitle>
                        <CardDescription>Users want to engage and earn.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="flex items-start gap-3">
                            <CheckSquare className="h-5 w-5 mt-1 text-primary shrink-0"/>
                            <span>Users visit the "Earn" page to find tasks, such as watching your video or clicking your link.</span>
                        </p>
                        <p className="flex items-start gap-3">
                             <CheckSquare className="h-5 w-5 mt-1 text-primary shrink-0"/>
                            <span>Upon task completion, they are instantly rewarded with VSD Lite tokens.</span>
                        </p>
                         <p className="flex items-start gap-3">
                             <CheckSquare className="h-5 w-5 mt-1 text-primary shrink-0"/>
                            <span><strong>Coming Soon:</strong> Users will also be able to earn rewards by participating in paid polls you create.</span>
                        </p>
                    </CardContent>
                </Card>
                 <Card className="bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListChecks className="h-6 w-6"/>The Business & Developer Process</CardTitle>
                        <CardDescription>Our AI-powered system makes it easy.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <StepCard step={1} icon={Send} title="Submit Your Application">
                            Fill out the form above with your business or project details. Be descriptive for the best analysis.
                        </StepCard>
                        <StepCard step={2} icon={Cpu} title="Instant AI Vetting">
                            Our AI analyzes your application in real-time for brand alignment and safety, providing an instant verdict.
                        </StepCard>
                        <div className="flex pt-4">
                            <div className="flex flex-col items-center mr-4">
                                <div>
                                    <div className="flex items-center justify-center w-10 h-10 border rounded-full border-green-500 text-green-500">
                                        3
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <KeyRound className="h-5 w-5 text-green-400" />
                                    <p className="text-lg font-semibold font-headline">Launch & Monitor</p>
                                </div>
                                <p className="text-muted-foreground">If approved, you are granted the appropriate role ('advertiser' or API access) and given your credentials. You can then access the Advertiser Dashboard or start using your API key and monitor usage in the Admin logs.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    </>
    );
}
