
import type { NavItem } from '@/types/nav';
import { LayoutDashboard, BrainCircuit, Network, Code, Briefcase, HelpCircle, FileText, Zap, ShieldAlert, TrendingUp, HandCoins, UserSquare, Banknote, Signal, ShoppingCart, Music, Shield, Gift, Settings, Share2 } from 'lucide-react';

export const siteConfig = {
  name: "VSD Network",
  description: "The official utility token and AI service hub for the Independent Media Group (IMG). Access exclusive AI tools (IMG Services), stake VSD for rewards, and participate in governance.",
  tokenValues: {
    CONVERSION_RATE: 100, // 100 VSD Lite = 1 VSD.
    VSD_PRICE_USD: 0.01,
    TOTAL_SUPPLY: 700000000,
  },
  mainNav: [
    { title: "Home", href: "/", icon: LayoutDashboard },
    { 
      title: "Token", 
      href: "/token", 
      icon: BrainCircuit, 
      description: "Utility, Tokenomics, Presale",
      subItems: [
        { title: "Token Details", href: "/token", description: "Presale, roadmap, and tokenomics." },
        { title: "Buy VSD with Card", href: "/buy", description: "Purchase tokens via Stripe." },
        { title: "Earn VSD", href: "/earn", description: "Complete tasks to earn VSD Lite." },
      ],
    },
    { title: "Ecosystem", href: "/ecosystem", icon: Network, description: "AI Tools & Partner dApps" },
    { 
      title: "For Partners",
      href: "/developers", 
      icon: Code, 
      description: "Docs for developers and businesses",
      subItems: [
        { title: "Developer Portal", href: "/developers", description: "SDKs, tools, and community links." },
        { title: "For Businesses", href: "/for-businesses", description: "Leverage VSD for your enterprise." },
        { title: "Whitepaper", href: "/developers/documentation", description: "The complete VSD technical document." },
        { title: "API Reference", href: "/developers/api-reference", description: "Technical details for our AI endpoints." },
        { title: "Integration Guide", href: "/developers/integration", description: "Connect your project to the network." },
      ],
    },
    { title: "Knowledge Base", href: "/symbi", icon: HelpCircle, description: "The complete guide to the VSD Network."},
  ] satisfies NavItem[],
  footerNav: [
    { title: "Whitepaper", href: "/developers/documentation" },
    { title: "For Businesses", href: "/for-businesses" },
    { title: "Project Integration", href: "/developers/integration" },
    { title: "API Reference", href: "/developers/api-reference" },
    { title: "Network Status", href: "/network-status" },
    { title: "Compliance", href: "/compliance" },
    { title: "Terms of Service", href: "/terms-of-service" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Knowledge Base", href: "/symbi" },
  ] satisfies Omit<NavItem, 'icon' | 'description'>[],
   secondaryNav: [
    { title: "Audio Exchange Demo", href: "/audio-exchange", icon: Music },
    { title: "Earn VSD Tokens", href: "/earn", icon: Gift },
  ] satisfies NavItem[],
  userNav: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Settings", href: "/settings", icon: Settings },
  ] satisfies NavItem[],
};
