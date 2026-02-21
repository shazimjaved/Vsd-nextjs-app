
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Share2, KeyRound, ShieldCheck, Workflow, AlertTriangle, ListChecks, Send, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CodeBlock = ({ children, lang = 'bash' }: { children: string; lang?: string }) => {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children);
        setCopied(true);
        toast({
            title: "Copied to clipboard!",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative my-4 rounded-md bg-muted/50 border">
            <div className="flex items-center justify-between px-4 py-2 border-b">
                <p className="text-xs font-semibold text-muted-foreground uppercase">{lang}</p>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs sm:text-sm">
                <code>
                    {children}
                </code>
            </pre>
        </div>
    );
};

const StepCard = ({ icon: Icon, title, step, children }: { icon: React.ElementType, title: string, step: number, children: React.ReactNode }) => (
    <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
                 <div className="flex items-center justify-center h-10 w-10 border rounded-full border-primary text-primary font-bold text-lg">
                    {step}
                </div>
                <Icon className="h-7 w-7 text-primary" />
                <CardTitle className="font-headline text-2xl">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base prose-invert max-w-none prose-p:my-2 prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80">
            {children}
        </CardContent>
    </Card>
);

export default function IntegrationPage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      <header className="text-center">
        <Share2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">How to Integrate Your Website</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect your project to the VSD Network in minutes using our automated, AI-powered onboarding system to leverage centralized AI services and token utilities.
        </p>
      </header>

      <Separator />

      <div className="space-y-8">
        <StepCard icon={Send} title="Register Your Project" step={1}>
            <p>Your project must first be registered as a "Tenant" within the VSD Network. Our AI-driven, self-service process makes this simple.</p>
            <p>Visit the <Link href="/for-businesses/register">API registration form</Link> and submit your project details. Our AI will instantly vet your application for compatibility and safety. Upon approval, you will **immediately receive your API key** on-screen.</p>
             <p>This key authenticates your project and proves it's a trusted partner in the IMG ecosystem.</p>
        </StepCard>

        <StepCard icon={ShieldCheck} title="Secure the API Key" step={2}>
            <p>In your new project's backend code, you must store this API key as a secure environment variable. Never expose this key in public client-side code (like a React component).</p>
            
            <div className="flex items-start gap-3 p-4 my-4 rounded-md border border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-8 w-8 text-amber-400 shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-yellow-200">Critical Security Warning</h4>
                    <p className="text-sm text-yellow-300">
                       Your API key provides direct, billable access to VSD services. It must be kept secret and only used on a secure server backend.
                    </p>
                </div>
            </div>
            
            <p>For a Next.js application, you would add it to a file named `.env.local` in your project's root:</p>
            <CodeBlock lang="bash">{`# .env.local
INTERNAL_API_KEY="vsd_key_..."`}</CodeBlock>
        </StepCard>
        
        <StepCard icon={Workflow} title="Make an Authenticated API Call" step={3}>
            <p>From your project's backend (e.g., a Next.js API route), make a `fetch` or `axios` request to a VSD Network endpoint. Include your API key in the `Authorization` header as a Bearer token.</p>
            <p>The correct URL depends on your environment. The code below shows how to handle this dynamically:</p>
            <CodeBlock lang="javascript">{`// Example in your external project's backend API route
// (e.g., /pages/api/your-endpoint.js)

// Determine the target URL dynamically.
// NEXT_PUBLIC_APP_URL is automatically set by Firebase App Hosting in production.
const getVsdApiUrl = (endpoint) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    return \`\${baseUrl}\${endpoint}\`;
};

export default async function handler(req, res) {
  const VSD_API_ENDPOINT = getVsdApiUrl('/api/generate-image');
  const API_KEY = process.env.INTERNAL_API_KEY;

  try {
    const response = await fetch(VSD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${API_KEY}\`
      },
      body: JSON.stringify({ hint: "a futuristic music studio" })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(\`API request failed: \${errorData.error}\`);
    }

    const data = await response.json();
    // Use the image data in your application
    res.status(200).json(data);

  } catch (error) {
    console.error("Error calling VSD API:", error);
    res.status(502).json({ error: 'Failed to communicate with VSD Network' });
  }
}`}
            </CodeBlock>
        </StepCard>

        <StepCard icon={ListChecks} title="Verify the Connection" step={4}>
            <p>How do you know if your integration is working? The **API Access Log** is your single source of truth.</p>
            <p>Go to the VSD Network <Link href="/admin/activity">Admin Dashboard</Link> and click on the **"Activity Logs"** tab. You should see a new entry corresponding to your API call from your new project:</p>
            <ul>
                <li>A **<span className="text-green-400">Success</span>** status with your project's name means your key is valid and your connection is working perfectly.</li>
                <li>A **<span className="text-red-400">Failure</span>** status means there is a problem with your API key (it's either missing or incorrect). Double-check that it's set correctly in your environment variables.</li>
            </ul>
            <p>This log provides instant, real-time feedback for debugging your connection.</p>
        </StepCard>
      </div>
      
    </div>
  );
}
