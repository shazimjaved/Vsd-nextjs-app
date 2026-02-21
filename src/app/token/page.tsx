
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Zap, Users, ShieldCheck, Cpu, PackagePlus, DollarSign, BrainCircuit, ArrowRight, Milestone, HandCoins, PiggyBank, CheckSquare } from "lucide-react";
import type { Metadata } from 'next';
import Link from "next/link";
import { AIImage } from "@/components/ai/AIImage";
import { PresaleInterface } from "@/components/token/PresaleInterface";
import imageData from '@/app/lib/placeholder-images.json';

export const metadata: Metadata = {
  title: 'VSD Utility Token | Presale & Tokenomics',
  description: 'Official utility token of the Independent Media Group (IMG). Detailed information about the VSD token, its tokenomics, active presale, and use cases in the AI-powered ecosystem.',
};

const FeatureItem = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="flex items-start space-x-3 sm:space-x-4">
    <div className="p-3 bg-primary/20 rounded-full border border-primary/30 mt-1">
      <Icon className="h-6 w-6 text-primary shrink-0" />
    </div>
    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-1 font-headline">{title}</h3>
      <p className="text-muted-foreground text-sm sm:text-base">{children}</p>
    </div>
  </div>
);

export default function TokenPage() {
  const { power, pie } = imageData.token;

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      <header className="text-center">
        <BrainCircuit className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">VSD Utility Token</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
         The essential asset for the IMG ecosystem. Discover VSD's utility in fueling AI services, its tokenomics, and how to participate.
        </p>
      </header>

      <Separator />

      <section id="what-is-vsd" className="space-y-8">
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-center">The Currency for an AI-Powered Economy</h2>
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
               <p className="text-base sm:text-lg">
                  VSD is the official utility token that powers the **Independent Media Group (IMG) ecosystem**. It is the primary vehicle for accessing a decentralized platform of AI-driven tools and services, including the flagship **IMG Services** suite.
               </p>
               <p className="text-muted-foreground">
                  Our mission is to democratize access to powerful AI by creating a token-powered network where holding VSD allows users to unlock exclusive AI tools, receive discounts, and participate in the platform's growth and governance.
               </p>
            </div>
             <AIImage
                initialSrc={power.src}
                alt={power.alt}
                width={700}
                height={350}
                className="rounded-md shadow-md w-full h-auto max-w-lg mx-auto"
                hint={power.hint}
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 pt-4">
           <FeatureItem icon={Cpu} title="Access IMG Services & AI Tools">
            Use VSD as the key to unlock access to our proprietary AI platform, including the IMG Services suite for content generation, and receive discounts on usage fees.
          </FeatureItem>
           <FeatureItem icon={PiggyBank} title="Stake VSD to Earn Rewards">
            Participate in the platform's success by staking your VSD tokens to earn rewards from a dedicated pool, as a function of network participation.
          </FeatureItem>
          <FeatureItem icon={Users} title="Participate in Governance">
            VSD holders can vote on key proposals that shape the future of the ecosystem, including new feature development, treasury allocation, and partnerships.
          </FeatureItem>
          <FeatureItem icon={HandCoins} title="Ecosystem Transactions">
            Utilize VSD for all transactions within the IMG ecosystem, from paying for services to potential future uses like royalty payouts and NFT licensing.
          </FeatureItem>
        </div>
      </section>

      <Separator />

      <section id="presale">
        <PresaleInterface />
      </section>

      <Separator />

      <section id="tokenomics" className="space-y-8">
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-center">VSD Tokenomics</h2>
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-xl sm:text-2xl">A Transparent Model for Sustainable Growth</CardTitle>
            <CardDescription className="text-sm sm:text-base">Designed for long-term growth, community incentivization, and platform development.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-left p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="text-md sm:text-lg font-semibold text-primary">Total Supply</h4>
                <p className="text-xl sm:text-2xl font-bold">1,000,000,000 VSD</p>
                <p className="text-xs text-muted-foreground mt-1">A fixed supply ensures a well-defined economic structure.</p>
              </div>
              <div>
                <h4 className="text-md sm:text-lg font-semibold text-primary">Token Symbol</h4>
                <p className="text-xl sm:text-2xl font-bold">VSD</p>
              </div>
              <div>
                <h4 className="text-md sm:text-lg font-semibold text-primary">Token Standard</h4>
                <p className="text-xl sm:text-2xl font-bold">ERC20</p>
                <p className="text-xs text-muted-foreground mt-1">Deployed on a secure and scalable EVM blockchain.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center pt-6">
                <div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">Token Allocation:</h4>
                    <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                        <li className="flex items-center"><strong className="text-foreground w-48">Public Presale:</strong> <span className="text-primary font-bold">20%</span></li>
                        <li className="flex items-center"><strong className="text-foreground w-48">Private Sale:</strong> <span className="text-primary font-bold">10%</span></li>
                        <li className="flex items-center"><strong className="text-foreground w-48">Staking & Incentives:</strong> <span className="text-primary font-bold">30%</span></li>
                        <li className="flex items-center"><strong className="text-foreground w-48">Team & Advisors:</strong> <span className="text-primary font-bold">15%</span> (Vested)</li>
                        <li className="flex items-center"><strong className="text-foreground w-48">Ecosystem Development:</strong> <span className="text-primary font-bold">15%</span></li>
                        <li className="flex items-center"><strong className="text-foreground w-48">Marketing & Liquidity:</strong> <span className="text-primary font-bold">10%</span></li>
                    </ul>
                </div>
                 <AIImage
                    initialSrc={pie.src}
                    alt={pie.alt}
                    width={700}
                    height={400}
                    className="rounded-md shadow-md w-full h-auto max-w-md mx-auto"
                    hint={pie.hint}
                 />
            </div>
            <div className="text-center pt-4">
                <Button asChild size="lg" className="font-bold btn-hover-effect">
                    <Link href="/developers/documentation#tokenomics">Read Full Tokenomics in Whitepaper <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section id="roadmap" className="space-y-8">
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-center">Project Roadmap</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Phase 1: Foundation & Presale", icon: Milestone, items: ["Whitepaper Release", "Private & Public Presale Rounds", "Core Smart Contract Audits", "Community Building"] },
            { title: "Phase 2: Platform Launch", icon: Cpu, items: ["VSD Banking Suite (MVP)", "Staking dApp Launch", "Initial Governance Portal", "Token Generation Event (TGE)"] },
            { title: "Phase 3: Ecosystem Expansion", icon: Users, items: ["Partner Integrations", "Developer SDKs Release", "AI Image Generation API (V1)", "IMG Services Suite Launch"] },
            { title: "Phase 4: Decentralization & Growth", icon: Zap, items: ["Full DAO Governance", "Paid User Polls for VSD Lite", "Token-to-Fiat Oracle", "AI Contract Studio (V2)"] },
          ].map(phase => (
            <Card key={phase.title} className="shadow-md bg-card/70 backdrop-blur-sm h-full flex flex-col transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50 border">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <phase.icon className="h-7 w-7 text-primary" />
                  <CardTitle className="font-headline text-lg sm:text-xl">{phase.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-xs sm:text-sm">
                  {phase.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-4">
             <Button asChild variant="outline">
                <Link href="/developers/documentation#roadmap">
                    View Detailed Roadmap in Whitepaper <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </section>

      <Separator />

      <section id="legal-disclaimer">
        <h2 className="font-headline text-xl sm:text-2xl font-semibold text-center mb-4">Legal Disclaimer</h2>
        <Card className="shadow-md bg-card/60 backdrop-blur-sm border-destructive/20">
          <CardContent className="p-4 sm:p-6 text-xs sm:text-sm text-muted-foreground">
            <p className="mb-2"><strong>IMPORTANT:</strong> The VSD Token is a utility token designed to grant access to services and features within the VSD Network ecosystem. VSD Tokens are not intended to constitute securities in any jurisdiction. This website, the whitepaper, or any related materials do not constitute a prospectus or offer document of any sort and are not intended to constitute an offer of securities or a solicitation for investment in securities.</p>
            <p className="mb-2">The information herein is not advice, nor a recommendation to acquire VSD Tokens. Participation in any token sale is at your own risk. Please consult with your legal, financial, and tax advisors before making any decisions. The VSD Network project is under development and subject to change. </p>
            <p>The VSD Foundation (or similar entity) is intended to be registered in a crypto-friendly jurisdiction and will operate in compliance with applicable local regulations. Citizens and residents of certain jurisdictions may be restricted from participating in the token sale. It is your responsibility to ensure compliance with the laws of your jurisdiction.</p>
            <p className="mt-4 text-center">
              <Link href="/compliance#sec-compliance" className="underline hover:text-primary">Read more about our approach to SEC compliance and token sales.</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
