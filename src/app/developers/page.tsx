
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BrainCircuit, Users, Github, MessageSquare, Package, Code, Server, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Portal | VSD Utility Token',
  description: 'Access the VSD Token Whitepaper, SDKs, API documentation, and community links for building with the VSD AI platform.',
};

export default function DevelopersPage() {
  return (
    <div className="space-y-12 py-8">
      <header className="text-center">
        <Code className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">Developer Portal</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your gateway to building with the VSD utility token and AI-powered VSD Network. Access the Whitepaper, SDKs, API reference, and join our developer community.
        </p>
      </header>

      <Separator />

      <section className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        <Card className="shadow-lg flex flex-col bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3" />
            <CardTitle className="font-headline text-xl sm:text-2xl">Whitepaper & Documentation</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Dive into the official VSD Token Whitepaper for a deep understanding of its utility, tokenomics, AI platform architecture, and integration guides.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/developers/documentation">Read Whitepaper</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg flex flex-col bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <Package className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3" />
            <CardTitle className="font-headline text-xl sm:text-2xl">SDKs & Tools</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Explore Software Development Kits and tools to integrate VSD token utility and AI services into your applications.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/developers/sdks-tools">Explore SDKs & Tools</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg flex flex-col bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <Server className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3" />
            <CardTitle className="font-headline text-xl sm:text-2xl">API Reference</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Access technical documentation for our AI endpoints, like the image generation API, to integrate VSD services directly into your projects.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/developers/api-reference">View API Docs</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-lg flex flex-col bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <Share2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3" />
            <CardTitle className="font-headline text-xl sm:text-2xl">Project Integration Guide</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Learn how to connect your external Firebase/GCP project to the VSD Network by setting up Service Account permissions and authenticating with our APIs.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/developers/integration">View Integration Guide</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
      
      <Separator />
      
      <section id="community">
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3" />
            <CardTitle className="font-headline text-xl sm:text-2xl">Community & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm sm:text-base">
              Connect with fellow developers, ask questions, share your projects, and contribute to the VSD ecosystem. This is also the best place to report bugs.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> GitHub (Report Bugs Here)
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-4 w-4" /> Discord (Developer Channel)
                </Link>
              </Button>
               <Button asChild variant="outline">
                <Link href="/developers/documentation#governance" target="_blank" rel="noopener noreferrer">
                   VSD Governance Forum
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}

    
