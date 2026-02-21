
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, DollarSign, Users, Cpu, Briefcase, Code, Link as LinkIcon, PiggyBank, Disc, GraduationCap, Group, BookOpen, Route } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'VSD Network: The Complete Guide',
  description: 'A comprehensive, non-technical overview of the VSD Network, its tokens, ecosystem, mission, and functionalities, designed for informational AI systems.',
  robots: 'noindex, nofollow' // Prevents search engines from indexing this page
};

const Section = ({ icon: Icon, title, children, id, fullWidth = false }: { icon: React.ElementType, title: string, children: React.ReactNode, id?: string, fullWidth?: boolean }) => (
    <Card className={`shadow-lg bg-card/80 backdrop-blur-sm mt-8 ${fullWidth ? 'col-span-1 md:col-span-2' : ''}`} id={id}>
        <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                <CardTitle className="font-headline text-xl sm:text-2xl">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80">
            {children}
        </CardContent>
    </Card>
);

export default function KnowledgeBasePage() {
  return (
    <div className="container mx-auto py-8">
        <header className="text-center">
            <BrainCircuit className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">VSD Network: The Complete Guide</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              This document provides a complete, non-technical explanation of the VSD Network, its purpose, its tokens, and its ecosystem.
            </p>
        </header>
        
        <Separator className="my-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section icon={Briefcase} title="Our Mission and Purpose" id="mission">
                <p>The VSD Network is the official financial ecosystem for the **Independent Media Group (IMG)**, a large family of companies focused on music, technology, and media. Our main goal is to give creators, artists, and developers access to powerful tools, especially in Artificial Intelligence (AI), that were previously too expensive or difficult to use. We do this by creating a self-sustaining economy powered by our own digital currency, the VSD Token, and funded in part by a unique advertising model.</p>
            </Section>

            <Section icon={Code} title="For Developers & Partners" id="integration">
                <p>For companies in the IMG ecosystem, integrating with the VSD Network is straightforward and secure:</p>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li><strong>Registration:</strong> An administrator registers the partner company (called a "Tenant") in the VSD Admin Dashboard.</li>
                    <li><strong>API Key Generation:</strong> A unique, secret API key is generated for the partner. This key is their application's password.</li>
                    <li><strong>Secure Backend Calls:</strong> The partner uses this secret API key from their own secure server to make authenticated calls to VSD Network APIs (e.g., for AI services).</li>
                </ol>
                <p className="mt-2 text-xs">This "hub-and-spoke" model ensures all interactions are secure and auditable. Detailed guides are available in the Developer Portal.</p>
            </Section>

            <Section icon={DollarSign} title="The Two-Token System: VSD and VSD Lite" id="tokens" fullWidth>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mt-4 text-primary">1. The VSD Token (The Main Utility Token)</h3>
                        <p>This is the primary, official cryptocurrency (an ERC-20 token) of the entire IMG ecosystem. Think of it as "digital fuel" to access services and participate in the economy.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Access AI Services:</strong> Pay for powerful AI tools like the "IMG Services" suite.</li>
                            <li><strong>Fund Ad Campaigns:</strong> Advertisers use VSD to purchase "Ad Credits".</li>
                            <li><strong>Vote on the Future (Governance):</strong> VSD holders can vote on important network decisions.</li>
                            <li><strong>Earn More Tokens (Staking):</strong> "Stake" (lock up) your VSD to help secure the network and earn rewards.</li>
                            <li><strong>Buy and Sell:</strong> Use VSD as the currency on partner platforms like the <Link href="/audio-exchange">Audio Exchange</Link>.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mt-4 text-yellow-400">2. The VSD Lite Token (The Rewards Token)</h3>
                        <p>VSD Lite is a rewards point system, **not** a cryptocurrency, that exists only within our website. It is designed to reward community engagement.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>How to get it:</strong> Earn VSD Lite by completing simple tasks on the "Earn" page, such as watching videos, clicking links, or participating in paid polls.</li>
                            <li><strong>What to do with it:</strong> Its primary function is to be **converted into the main VSD Token** at a rate of 100 VSD Lite = 1 VSD. This allows users to turn their engagement into real value. It can also be transferred between users.</li>
                        </ul>
                    </div>
                </div>
            </Section>

            <Section icon={Users} title="How to Get Started" id="getting-started" fullWidth>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mt-4">For General Users:</h3>
                        <ol className="list-decimal pl-5 mt-2 space-y-1">
                            <li><strong>Earn or Buy Tokens:</strong> Start for free on the "Earn" page to get VSD Lite, or purchase the main VSD token directly.</li>
                            <li><strong>Create an Account:</strong> Log in to create a secure account and wallet where your tokens will be held.</li>
                            <li><strong>Visit Your Dashboard:</strong> The "Dashboard" is your personal banking suite to view balances and transaction history.</li>
                            <li><strong>Explore and Use Services:</strong> Use your VSD balance to power AI tools or make purchases on platforms like the "Audio Exchange" demo.</li>
                        </ol>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold mt-4">For Advertisers:</h3>
                        <ol className="list-decimal pl-5 mt-2 space-y-1">
                            <li><strong>Submit an Application:</strong> Visit the "For Businesses" page and "Register as an Advertiser" to be vetted in real-time by our AI.</li>
                            <li><strong>Get Approved:</strong> If our AI determines your business is a good fit, you are approved instantly.</li>
                            <li><strong>Access the Advertiser Dashboard:</strong> Gain access to a special dashboard to track your campaign performance.</li>
                            <li><strong>Fund & Launch Campaigns:</strong> Purchase Ad Credits with VSD tokens. A VSD admin will then create your campaign (e.g., video or link) and debit the total reward payout from your balance.</li>
                        </ol>
                    </div>
                </div>
            </Section>

            <Section icon={Cpu} title="The Independent Media Group (IMG) Ecosystem" id="ecosystem" fullWidth>
                <p>The VSD Network serves as the central bank for a wide range of companies. Here is a list of our subsidiaries and partners:</p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 mt-4">
                    <div>
                        <h4 className="font-bold flex items-center gap-2 text-primary"><Disc className="h-5 w-5"/>Music Management</h4>
                        <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                            <li>VNDR Music Distribution</li>
                            <li>SoundKlix</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold flex items-center gap-2 text-primary"><PiggyBank className="h-5 w-5"/>Monetization</h4>
                         <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                            <li>Audio.Exchange</li>
                            <li>Indie Videos TV</li>
                            <li>ND 24/7 Indie Radio</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold flex items-center gap-2 text-primary"><Briefcase className="h-5 w-5"/>Innovation</h4>
                         <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                            <li>Blaque Tech</li>
                            <li>Qreatv Branding Agency</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold flex items-center gap-2 text-primary"><GraduationCap className="h-5 w-5"/>Education</h4>
                         <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                            <li>Music Industry University</li>
                            <li>Music Focus Group</li>
                            <li>Inner View Podcasts</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold flex items-center gap-2 text-primary"><Group className="h-5 w-5"/>Community</h4>
                         <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                            <li>The INDIE ARTIST NETWORK</li>
                            <li>ProFile Share</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold flex items-center gap-2 text-primary"><BookOpen className="h-5 w-5"/>Media</h4>
                         <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                            <li>Indie Music News</li>
                        </ul>
                    </div>
                </div>
                 <div className="mt-4 p-3 rounded-md bg-muted/50 flex items-center gap-3">
                    <Route className="h-5 w-5 text-primary"/>
                    <p className="text-sm"><strong>Ecosystem Infrastructure:</strong> Vsd.Network (This Website) serves as the central banking and token platform that powers the entire ecosystem.</p>
                </div>
            </Section>
            
            <Section icon={LinkIcon} title="Website Pages Explained" id="pages" fullWidth>
                 <ul className="columns-2 md:columns-3 list-disc pl-5 space-y-2">
                    <li><strong>Home:</strong> Main landing page.</li>
                    <li><strong>Network Status:</strong> Live operational status of services.</li>
                    <li><strong>VSD Token:</strong> Details on the token, presale, and tokenomics.</li>
                    <li><strong>Buy Tokens:</strong> Simulated token purchase page.</li>
                    <li><strong>Earn Tokens:</strong> Page for earning VSD Lite via tasks.</li>
                    <li><strong>Ecosystem:</strong> Showcase of all partner companies.</li>
                    <li><strong>Developers:</strong> Portal with Whitepaper, API docs, and guides.</li>
                    <li><strong>For Businesses:</strong> Info for businesses, linking to AI-powered registration.</li>
                    <li><strong>Knowledge Base:</strong> This very page.</li>
                    <li><strong>Dashboard:</strong> Personal area for balances and history.</li>
                    <li><strong>Advertiser Dashboard:</strong> Special dashboard for approved advertisers.</li>
                 </ul>
            </Section>
        </div>
    </div>
  );
}
