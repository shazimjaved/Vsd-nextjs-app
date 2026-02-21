
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BrainCircuit, Library, Workflow, Cpu, GitBranch, HelpCircle, Layers, FileJson, Zap, Users, PackagePlus, DollarSign, Milestone, ListChecks, Aperture, ShieldCheck, HandCoins, FileSignature, TrendingUp } from "lucide-react";
import Link from 'next/link';
import { AIImage } from '@/components/ai/AIImage';
import imageData from '@/app/lib/placeholder-images.json';

export const metadata: Metadata = {
  title: 'VSD Token Whitepaper & Documentation',
  description: 'The official Whitepaper for the VSD utility token, the currency of the Independent Media Group (IMG), covering the IMG Banking System, tokenomics, utility, and roadmap.',
};

const SectionCard = ({ icon: Icon, title, description, children, id }: { icon: React.ElementType, title: string, description?: string, children: React.ReactNode, id?: string }) => (
  <Card className="shadow-lg bg-card/80 backdrop-blur-sm" id={id}>
    <CardHeader>
      <div className="flex items-center space-x-3 mb-2">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
        <CardTitle className="font-headline text-2xl sm:text-3xl">{title}</CardTitle>
      </div>
      {description && <CardDescription className="text-base sm:text-lg">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="prose prose-sm sm:prose-base prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80">
      {children}
    </CardContent>
  </Card>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto my-4 text-xs sm:text-sm">
        <code>
            {children}
        </code>
    </pre>
);

export default function WhitepaperDocumentationPage() {
  const { vision, architecture, tokenomics } = imageData.documentation;

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      <header className="text-center">
        <BrainCircuit className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">VSD Utility Token Whitepaper</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          An in-depth overview of the VSD Token as the official financial backbone for the Independent Media Group (IMG), its utility, tokenomics, and roadmap.
        </p>
        <p className="text-xs text-muted-foreground mt-2">Version 2.0 - [Current Date Placeholder]</p>
      </header>

      <Separator />

      <SectionCard icon={Library} title="1. Introduction: The VSD Vision" description="Powering a decentralized economy for AI and creative assets." id="introduction">
        <p>The digital landscape is rapidly converging around Artificial Intelligence (AI) and decentralized technologies. The VSD Network stands at this intersection as the official financial infrastructure for the **Independent Media Group (IMG)**. Our mission is to democratize access to previously gate-kept services and tools by creating a secure, transparent, and user-centric ecosystem—the IMG Banking System. By leveraging VSD utility tokens and a community-driven ad-revenue model, we empower creators, developers, and platform participants to transact, collaborate, and innovate without traditional barriers.</p>
        <p>This whitepaper details the comprehensive utility of the VSD token, the tokenomics that sustain the ecosystem, our strategic roadmap, and the technical architecture that makes it all possible. We invite you to join us in building the future of the decentralized creative economy.</p>
        <AIImage
          initialSrc={vision.src}
          alt={vision.alt}
          width={800}
          height={400}
          className="rounded-md my-6 shadow-md mx-auto max-w-full h-auto" 
          hint={vision.hint}
        />
      </SectionCard>

      <Separator />

      <SectionCard icon={Zap} title="2. VSD Token Utility" description="The multifaceted role of VSD within the IMG Banking System." id="utility">
        <p>The VSD token is the lifeblood of the VSD Network, designed with multiple utilities to drive a vibrant and self-sustaining economy:</p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong><HandCoins className="inline-block h-5 w-5 mr-2 text-primary" />Automated Payouts:</strong> Facilitating automated, transparent, and instant royalty or service payouts for artists and creators, executed via smart contracts.</li>
            <li><strong><TrendingUp className="inline-block h-5 w-5 mr-2 text-primary" />Platform Access & Governance:</strong> The primary vehicle for accessing ecosystem services, participating in special events, and voting on platform-wide decisions.</li>
            <li><strong><FileSignature className="inline-block h-5 w-5 mr-2 text-primary" />Licensing & Payments:</strong> The standard currency for licensing media, purchasing digital collectibles on platforms like AUDEX, and settling transactions for digital goods within the ecosystem.</li>
            <li><strong><Cpu className="inline-block h-5 w-5 mr-2 text-primary" />Pay-per-Use AI Services:</strong> Access to the VSD Network's proprietary IMG services, AI-powered tools, and APIs, with usage fees paid in VSD.</li>
            <li><strong><PackagePlus className="inline-block h-5 w-5 mr-2 text-primary" />Membership & Staking Rewards:</strong> Staking VSD tokens to secure the network, earn yield as a reward for participation, and unlock tiered membership benefits like reduced fees and exclusive access.</li>
            <li><strong><Users className="inline-block h-5 w-5 mr-2 text-primary" />Crowdfunding & Platform Governance:</strong> Powering community-driven funding for new projects and enabling VSD holders to vote on key decisions that shape the ecosystem's future.</li>
        </ul>
      </SectionCard>

      <Separator />

      <SectionCard icon={FileJson} title="3. Tokenomics & Presale" description="Detailed breakdown of VSD token distribution, supply, and presale plan." id="tokenomics">
        <p>The VSD tokenomics are structured to ensure a balanced distribution, incentivize long-term platform participation, fund ongoing development, and foster a vibrant community. For full details including presale stages, pricing, and accepted currencies, please visit the <Link href="/token#tokenomics">VSD Token Page</Link>.</p>
        <h4 className="text-xl sm:text-2xl mt-6 mb-2">Token Allocation:</h4>
        <AIImage
            initialSrc={tokenomics.src}
            alt={tokenomics.alt}
            width={700}
            height={450}
            className="rounded-md my-4 shadow-md mx-auto"
            hint={tokenomics.hint}
        />
        <ul className="list-disc pl-5 space-y-1">
            <li><strong>Public Presale:</strong> 20% (200,000,000 VSD)</li>
            <li><strong>Private Sale:</strong> 10% (100,000,000 VSD)</li>
            <li><strong>Staking Rewards & Ecosystem Incentives:</strong> 30% (300,000,000 VSD)</li>
            <li><strong>Team & Advisors:</strong> 15% (150,000,000 VSD) - Vested</li>
            <li><strong>Ecosystem Development Fund:</strong> 15% (150,000,000 VSD)</li>
            <li><strong>Marketing & Liquidity:</strong> 10% (100,000,000 VSD)</li>
        </ul>
        <h4 className="text-xl sm:text-2xl mt-8 mb-2">Presale Plan Overview:</h4>
        <p>The VSD token presale will be conducted to raise capital for development, marketing, and legal expenses. Funds will be raised via ETH/USDT. Participants will undergo KYC/AML verification. For more details on how to participate, visit the <Link href="/token#presale">VSD Token Page</Link>.</p>
      </SectionCard>

      <Separator />
      
      <SectionCard icon={Workflow} title="4. VSD Network Architecture" description="The technical foundation of the IMG Banking System." id="architecture">
        <p>The VSD Network is a multi-layered system designed for security, scalability, and seamless integration between on-chain and off-chain data. This project's backend is the central ledger and engine for the entire ecosystem.</p>
        <AIImage
          initialSrc={architecture.src}
          alt={architecture.alt}
          width={800}
          height={450}
          className="rounded-md my-6 shadow-md mx-auto max-w-full h-auto" 
          hint={architecture.hint}
        />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="arch-core">
            <AccordionTrigger className="text-lg sm:text-xl hover:no-underline">VSDNetworkCore (Firestore Ledger)</AccordionTrigger>
            <AccordionContent>
              <p>The heart of the system is a secure off-chain ledger built on Firestore. It manages user wallets (linked to Firebase Auth UIDs), tracks real-time VSD balances, and records every transaction. This provides a fast and cost-effective experience for users, with periodic on-chain settlements.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="arch-engine">
            <AccordionTrigger className="text-lg sm:text-xl hover:no-underline">SmartContractEngine (Cloud Functions)</AccordionTrigger>
            <AccordionContent>
              <p>This module, powered by Cloud Functions, dynamically generates and deploys Solidity smart contracts. When a user requests a contract (e.g., for a royalty split) via the frontend, a Firestore document is created, triggering a function like the one below. This function compiles a predefined template, deploys it to the blockchain, and saves the contract address and ABI back to Firestore.</p>
              <h5 className="font-headline text-lg text-primary mt-4">Example Cloud Function Trigger:</h5>
              <CodeBlock>
{`// Trigger this function when a new contract request is added
exports.deploySmartContract = functions.firestore
  .document('contracts/{contractId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const { contractType, terms, userAddress } = data;

    // Logic to compile a Solidity template based on contractType and terms
    const compiled = compileSolidityTemplate(contractType, terms);
    
    // Logic to deploy the contract to the blockchain
    const deployed = await deployToBlockchain(compiled, userAddress);

    // Update the Firestore document with the deployment result
    await snap.ref.update({
      contractAddress: deployed.address,
      abi: deployed.abi,
      status: 'deployed',
      timestamp: Date.now()
    });
  });`}
              </CodeBlock>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="arch-sync">
            <AccordionTrigger className="text-lg sm:text-xl hover:no-underline">On-Chain Sync (Webhooks)</AccordionTrigger>
            <AccordionContent>
              <p>To keep the off-chain Firestore ledger consistent with the blockchain, we use webhook listeners (e.g., via a Firebase Extension). When an on-chain event occurs (like a token transfer to a user's deposit address), the webhook calls a Cloud Function that updates the corresponding user's balance in Firestore, ensuring the dashboard reflects the true state.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="arch-compliance">
            <AccordionTrigger className="text-lg sm:text-xl hover:no-underline">Compliance Layer</AccordionTrigger>
            <AccordionContent>
              <p>Built into the core, this layer manages user identity, roles (e.g. Artist, Developer), and enforces rules based on geography or wallet status, ensuring the ecosystem remains compliant with evolving regulations.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SectionCard>

      <Separator />

      <SectionCard icon={Milestone} title="5. Project Roadmap" description="Our phased approach to building the IMG Banking System." id="roadmap">
        <p>The VSD Network will be developed and rolled out in distinct phases. For the latest updates, please refer to our official announcements or the more detailed visual roadmap on the <Link href="/token#roadmap">VSD Token page</Link>.</p>
      </SectionCard>
      
      <Separator />

      <SectionCard icon={ShieldCheck} title="6. Legal Disclaimer & Risk Factors" description="Important information regarding VSD tokens and participation." id="legal">
        <p className="font-semibold">Please read this section carefully before participating in any token sale or using VSD tokens.</p>
        <p>The VSD Token is a utility token. It is not intended to constitute a security. This whitepaper does not constitute a prospectus or offer document of any sort and is not intended to constitute an offer of securities or a solicitation for investment in securities in any jurisdiction. Acquiring VSD tokens is for the primary purpose of their utility within the VSD Network.</p>
        <p>The purchase of VSD tokens involves significant risk. The VSD Network project is under development and its features, roadmap, and tokenomics are subject to change. There is no guarantee that the project will achieve its objectives. By purchasing, holding, or using VSD tokens, you acknowledge and agree that you have read, understood, and accepted all the terms, conditions, and risks. You are solely responsible for ensuring compliance with the laws of your jurisdiction.</p>
      </SectionCard>

    </div>
  );
}
