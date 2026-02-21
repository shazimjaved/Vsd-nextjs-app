
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Code, KeyRound, Server, FileJson, Banknote, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Master API Reference | VSD Network',
  description: 'The official and complete API documentation for integrating with the VSD Network Hub (IMG Bank), including AI services and transaction handling.',
};

const CodeBlock = ({ children, lang = 'json' }: { children: React.ReactNode; lang?: string }) => (
    <pre className={`bg-muted/50 p-4 rounded-md overflow-x-auto my-4 text-xs sm:text-sm language-${lang}`}>
        <code>
            {children}
        </code>
    </pre>
);

const ApiSection = ({ icon: Icon, title, description, endpoint, method, requestParams, successResponse, children }: { icon: React.ElementType, title: string, description: string, endpoint: string, method: 'POST' | 'GET', requestParams: any[], successResponse: string, children: React.ReactNode }) => (
    <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                <CardTitle className="font-headline text-2xl sm:text-3xl">{title}</CardTitle>
            </div>
            <CardDescription className="text-base sm:text-lg">
                {description}
            </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base prose-invert max-w-none prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80">
            <h3 className="text-xl sm:text-2xl">Endpoint</h3>
            <CodeBlock lang="bash">{`${method} ${endpoint}`}</CodeBlock>
            
            <Separator className="my-6" />

            <h3 className="text-xl sm:text-2xl">Request Parameters</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left my-4">
                    <thead className="border-b">
                        <tr>
                            <th className="p-2">Parameter</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Required</th>
                            <th className="p-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestParams.map(param => (
                            <tr key={param.name} className="border-b">
                                <td className="p-2 font-mono text-sm">{param.name}</td>
                                <td className="p-2 font-mono text-sm">{param.type}</td>
                                <td className="p-2">{param.required ? 'Yes' : 'No'}</td>
                                <td className="p-2">{param.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Separator className="my-6" />
            
            {children}

            <Separator className="my-6" />
            
            <h3 className="text-xl sm:text-2xl">Success Response</h3>
            <p>A successful request returns a JSON object with the following structure.</p>
            <CodeBlock>{successResponse}</CodeBlock>

             <Separator className="my-6" />

            <h3 className="text-xl sm:text-2xl">Error Responses</h3>
            <ul className="list-disc pl-5 mt-4 space-y-2">
                <li><strong>400 Bad Request:</strong> The request body is missing required fields, is not valid JSON, or contains invalid data (e.g., empty hint).</li>
                <li><strong>401 Unauthorized:</strong> The `Authorization` header is missing or the provided API key is invalid.</li>
                <li><strong>500 Internal Server Error:</strong> An unexpected error occurred on the server, such as a failure in the AI model or an unhandled exception.</li>
            </ul>
        </CardContent>
    </Card>
);

export default function ApiReferencePage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      <header className="text-center">
        <Server className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">Master API Reference</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          The official hub for integrating with the VSD Network's centralized services. This document provides all the details needed to connect your project to the IMG Bank.
        </p>
      </header>
      
      <Separator />

      <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
                <KeyRound className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                <CardTitle className="font-headline text-2xl sm:text-3xl">Authentication & Usage</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base prose-invert max-w-none">
            <p>Authentication is handled via a Bearer token in the `Authorization` header. Your project must make all API calls from a secure, server-side environment to protect your secret API key. Do not expose this key in any client-side code.</p>
             <CodeBlock lang="bash">{`Authorization: Bearer YOUR_INTERNAL_API_KEY`}</CodeBlock>
            <div className="flex items-start gap-3 p-4 my-4 rounded-md border border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-8 w-8 text-amber-400 shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-yellow-200">Security & Billing Notice</h4>
                    <p className="text-sm text-yellow-300">
                        Your `INTERNAL_API_KEY` provides direct access to VSD Network services. Treat it like a password. All API usage is metered and will eventually require VSD tokens for payment. Unauthorized use of your key can result in billing against your account. For instructions on how to set up permissions for a twin project, see the <Link href="/developers/integration">Project Integration Guide</Link>.
                    </p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Separator />

      <ApiSection
        icon={Code}
        title="AI Image Generation API (IMG Bank)"
        description="The official endpoint to generate images using the VSD AI engine."
        endpoint="/api/generate-image"
        method="POST"
        requestParams={[
            { name: 'hint', type: 'string', required: true, description: 'A detailed textual prompt to guide the image generation process.' }
        ]}
        successResponse={`{\n  "imageDataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."\n}`}
      >
        <></>
      </ApiSection>

      <Separator />
      
      <ApiSection
        icon={Banknote}
        title="VSD Transaction API (Mock)"
        description="This endpoint simulates the creation of a VSD token transaction."
        endpoint="/api/transactions"
        method="POST"
        requestParams={[
            { name: 'fromAddress', type: 'string', required: true, description: 'The wallet address of the sender.' },
            { name: 'toAddress', type: 'string', required: true, description: 'The wallet address of the recipient.' },
            { name: 'amount', type: 'number', required: true, description: 'The amount of VSD to transfer. Must be greater than 0.' },
            { name: 'description', type: 'string', required: false, description: 'An optional note or memo for the transaction.' },
        ]}
        successResponse={`{\n  "transactionId": "txn_...",\n  "status": "completed",\n  "timestamp": "...",\n  "fromAddress": "0xYourAddress...",\n  "toAddress": "0xRecipientAddress...",\n  "amount": 150.5,\n  "currency": "VSD",\n  "description": "Payment for services",\n  "mock": true\n}`}
      >
        <div className="flex items-start gap-3 p-4 my-4 rounded-md border border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-8 w-8 text-yellow-400 shrink-0 mt-1" />
            <div>
                <h4 className="font-bold text-yellow-200">Demonstration Only</h4>
                <p className="text-sm text-yellow-300">
                    This is a **mock API endpoint**. It does not connect to a real ledger or blockchain. It performs basic validation and returns a simulated successful transaction object to help you build and test your application's frontend and integration logic.
                </p>
            </div>
        </div>
      </ApiSection>

    </div>
  );
}
