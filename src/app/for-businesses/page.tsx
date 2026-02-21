
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, Cpu, Puzzle, Users, Briefcase, ArrowRight, Sparkles, Lightbulb, TrendingUp } from 'lucide-react';
import { AIImage } from '@/components/ai/AIImage';

export const metadata: Metadata = {
  title: 'VSD Utility Token for Businesses',
  description: 'Leverage the VSD utility token and AI platform to enhance your business operations, access exclusive AI tools like IMG Services, and engage with the Web3 economy.',
};

const BenefitCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <Card className="shadow-lg bg-card/80 backdrop-blur-sm h-full">
    <CardHeader className="items-center text-center">
      <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3" />
      <CardTitle className="font-headline text-xl sm:text-2xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-center text-sm sm:text-base">{children}</p>
    </CardContent>
  </Card>
);

export default function ForBusinessesPage() {
  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      <header className="text-center">
        <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">Empower Your Business with VSD Utility</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover how the VSD utility token and the VSD Network's AI platform can unlock new efficiencies, innovative solutions like IMG Services, and growth opportunities for your enterprise.
        </p>
      </header>

      <Separator />

      <section>
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-center mb-10">Why Integrate VSD Utility in Your Business?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <BenefitCard icon={Cpu} title="Access Cutting-Edge AI">
            Utilize VSD tokens to access our suite of AI tools, including the powerful IMG Services for content creation and analytics, to streamline workflows and gain data-driven insights.
          </BenefitCard>
          <BenefitCard icon={TrendingUp} title="Targeted Advertising & Reporting">
            Become an advertiser on the VSD Network. Your campaigns reach engaged users, and you get access to a dashboard to track performance metrics like clicks and rewards distributed.
          </BenefitCard>
          <BenefitCard icon={Puzzle} title="Seamless Integration">
            Our planned APIs and SDKs will enable easy integration of VSD AI services and token functionalities into your existing platforms and applications.
          </BenefitCard>
          <BenefitCard icon={Zap} title="Efficient Service Access">
            VSD tokens can offer a more predictable and potentially cost-effective way to pay for AI services and advertising compared to traditional models.
          </BenefitCard>
          <BenefitCard icon={Users} title="Engage with Web3 Economy">
            Connect with a growing ecosystem of Web3 users, developers, and partners by incorporating VSD utility, opening new avenues for collaboration and market reach.
          </BenefitCard>
           <BenefitCard icon={Lightbulb} title="Custom AI Solutions">
            Explore opportunities for tailored AI solutions leveraging the VSD Network's capabilities to address specific business challenges. (Consult with our team).
          </BenefitCard>
        </div>
      </section>
      
      <Separator />

      <section className="text-center bg-card/70 p-6 sm:p-8 md:p-12 rounded-lg shadow-xl">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold mb-4">Ready to Advertise with Us?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm sm:text-base">
          Join our network of advertisers to reach an engaged community of creators and tech enthusiasts. Our AI-powered onboarding process will guide you through the next steps.
        </p>
        <Button asChild size="lg" className="font-bold btn-hover-effect">
            <Link href="/for-businesses/register">
                Register as an Advertiser <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
        </Button>
      </section>

      <Separator />

      <section>
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-center mb-10">Potential Use Cases for VSD in Your Enterprise</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg sm:text-xl">Automated Content & Marketing</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground text-sm sm:text-base">Use VSD-powered AI tools (IMG Services) to generate marketing copy, social media posts, product descriptions, and engaging visuals at scale.</p></CardContent>
            </Card>
            <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg sm:text-xl">Performance-Based Advertising</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground text-sm sm:text-base">Launch campaigns on the VSD "Earn" platform. Pay VSD Lite tokens directly to users for engaging with your content and track results in your advertiser dashboard.</p></CardContent>
            </Card>
            <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg sm:text-xl">Personalized Customer Experiences</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground text-sm sm:text-base">Leverage AI to personalize recommendations, support interactions, or tailor service offerings based on individual customer profiles and behavior.</p></CardContent>
            </Card>
            <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg sm:text-xl">Data Analysis & Reporting</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground text-sm sm.text-base">Employ AI tools for advanced data analysis, trend identification, and automated report generation to make more informed business decisions.</p></CardContent>
            </Card>
            <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg sm:text-xl">Building AI-Powered Applications</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground text-sm sm:text-base">Developers and businesses can use VSD SDKs and APIs to build their own applications on top of the VSD AI platform, paying for AI resource consumption with VSD tokens.</p></CardContent>
            </Card>
             <Card className="shadow-md">
                <CardHeader><CardTitle className="text-lg sm:text-xl">Corporate Treasury & Web3 Participation</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground text-sm sm:text-base">Hold VSD as a utility asset for accessing AI services or participate in the VSD ecosystem's governance, aligning with innovative Web3 trends.</p></CardContent>
            </Card>
        </div>
      </section>

    </div>
  );
}
