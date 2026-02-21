
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Layers, TerminalSquare, GitBranch, RadioTower } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SDKs & Tools | VSD Network',
  description: 'Official Software Development Kits (SDKs) and tools for integrating with the VSD AI API and VSD utility token smart contracts.',
};

const SdkCard = ({ icon: Icon, title, status, children, githubLink }: { icon: React.ElementType, title: string, status: string, children: React.ReactNode, githubLink?: string }) => (
  <Card className="shadow-lg bg-card/80 backdrop-blur-sm h-full flex flex-col">
    <CardHeader>
      <div className="flex items-center space-x-3 mb-2">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
        <CardTitle className="font-headline text-xl sm:text-2xl">{title}</CardTitle>
      </div>
      <CardDescription className="text-sm font-semibold text-primary/80">{status}</CardDescription>
    </CardHeader>
    <CardContent className="prose prose-sm sm:prose-base prose-invert max-w-none flex-grow">
      {children}
    </CardContent>
    {githubLink && (
      <CardFooter>
        <Button variant="outline" asChild className="mt-6 w-full">
          <Link href={githubLink} target="_blank" rel="noopener noreferrer">
            <GitBranch className="mr-2 h-4 w-4" /> View on GitHub (Placeholder)
          </Link>
        </Button>
      </CardFooter>
    )}
  </Card>
);

export default function SdksToolsPage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      <header className="text-center">
        <Package className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">SDKs & Tools</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          The official toolset for building on the VSD Network. Integrate VSD AI services and token utility into your projects seamlessly.
        </p>
      </header>

      <Separator />

      <SdkCard icon={Layers} title="JavaScript/TypeScript SDK" status="In Development">
        <p>A comprehensive JavaScript/TypeScript SDK to simplify interaction with the VSD ecosystem from Node.js or browser environments (dApps).</p>
        <h4 className="text-lg sm:text-xl mt-4 mb-2">Key Features:</h4>
        <ul className="list-disc pl-5">
          <li><strong>AI Service Integration:</strong> Programmatically call the AI Image Generation API.</li>
          <li><strong>Token Utility:</strong> Check VSD balances and handle token transfers.</li>
          <li><strong>Staking & Governance:</strong> Interact with staking contracts and participate in DAO proposals.</li>
          <li><strong>Wallet Integration Helpers:</strong> Utilities to streamline wallet connections.</li>
        </ul>
        <pre className="bg-muted/50 p-4 rounded-md overflow-x-auto my-4 text-xs sm:text-sm">
          <code>
{`// Installation (Example)
npm install @vsdnetwork/sdk

// Basic Usage (Illustrative)
import { VsdClient } from '@vsdnetwork/sdk';

const vsd = new VsdClient({ apiKey: 'YOUR_API_KEY' });

// Call the central IMG Bank
async function generateAiImage(prompt) {
  const result = await vsd.ai.generateImage({
    hint: prompt,
  });
  console.log('Image Data URI:', result.imageDataUri);
  return result.imageDataUri;
}

// Check a VSD token balance
async function checkBalance(address) {
    const balance = await vsd.token.balanceOf(address);
    console.log('VSD Balance:', balance);
    return balance;
}
`}
          </code>
        </pre>
        <p>This SDK provides the canonical way to interact with the VSD backend, ensuring awareness of the central token and service ledger.</p>
      </SdkCard>

      <Separator />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <SdkCard icon={RadioTower} title="Python SDK" status="Planned">
          <p>A Python SDK is planned to cater to backend developers and data scientists looking to leverage VSD AI services or build integrations.</p>
          <p><strong>Expected Features:</strong> AI service calls, data analysis helpers, batch processing, and smart contract event listeners.</p>
          <p className="mt-4 text-xs sm:text-sm">Stay tuned for updates on its development progress.</p>
        </SdkCard>

        <SdkCard icon={RadioTower} title="Go SDK" status="Planned">
          <p>For developers building high-performance backend services, indexers, or tools, we plan to release a native Go SDK.</p>
          <p><strong>Expected Features:</strong> Core protocol interactions, type-safe smart contract bindings, and efficient transaction management.</p>
           <p className="mt-4 text-xs sm:text-sm">Follow our announcements for availability.</p>
        </SdkCard>

        <SdkCard icon={TerminalSquare} title="VSD CLI" status="Planned">
          <p>A Command-Line Interface (CLI) is on our roadmap for quick and easy interaction with the VSD Network directly from your terminal.</p>
          <p><strong>Potential Uses:</strong> Querying AI service status, checking token balances, managing API keys, and interacting with governance.</p>
          <p className="mt-4 text-xs sm:text-sm">Development will commence after core SDKs are stable.</p>
        </SdkCard>
      </div>

      <Separator />

      <section className="text-center py-8">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold mb-4">Stay Updated & Contribute</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-sm sm:text-base">
          Follow our progress on GitHub and join our developer community for the latest announcements on SDKs, tools, and other resources.
        </p>
        <Button asChild size="lg">
          <Link href="/developers#community">Developer Community & GitHub</Link>
        </Button>
      </section>

    </div>
  );
}
