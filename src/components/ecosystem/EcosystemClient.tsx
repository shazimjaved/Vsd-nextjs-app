
'use client';

import React from 'react';
import { Network, Disc, PiggyBank, Briefcase, GraduationCap, Group, BookOpen, Route, ArrowUpRightSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { AIImage } from '@/components/ai/AIImage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import imageData from '@/app/lib/placeholder-images.json';

export interface Subsidiary {
  name: string;
  description: string;
  link: string;
  logoUrl?: string;
  imageKey: keyof typeof imageData.ecosystem;
}

export interface SubsidiaryCategory {
  category: string;
  id: string;
  icon: React.ElementType;
  subsidiaries: Subsidiary[];
}

const imgEcosystem: SubsidiaryCategory[] = [
    {
        category: "Music Management & Distribution",
        id: "music-management-distribution",
        icon: Disc,
        subsidiaries: [
            {
                name: "VNDR Music Distribution",
                description: "Music Distribution and music publishing platform.",
                link: "https://VNDRmusic.com",
                logoUrl: "https://i.ibb.co/LzYSVCtz/Background-Eraser-20251014-181324183.png",
                imageKey: "vndr",
            },
            {
                name: "SoundKlix",
                description: "Music streaming platform for indie artists.",
                link: "https://SoundKlix.com",
                logoUrl: "https://i.ibb.co/M53tfW4r/6afe7afc-3816-4f85-a250-50819e0f1b00.png",
                imageKey: "soundklix",
            }
        ]
    },
    {
        category: "Financial & Monetization Platforms",
        id: "financial-monetization-platforms",
        icon: PiggyBank,
        subsidiaries: [
            {
                name: "Audio.Exchange",
                description: "A decentralized marketplace that revolutionizes music monetization by treating songs as unique digital collectibles.",
                link: "https://Audio.Exchange",
                logoUrl: "https://i.ibb.co/fVjNMVpk/logo2.png",
                imageKey: "audioExchange",
            },
            {
                name: "Indie Videos TV",
                description: "A 24/7 indie-only music video platform that pays artists for music video plays.",
                link: "https://IndieVideos.TV",
                logoUrl: "https://i.ibb.co/0RzJsCss/image.png",
                imageKey: "indieVideos",
            },
            {
                name: "ND 24/7 Indie Radio",
                description: "An all-indie radio station that showcases independent audio artists and pays for plays.",
                link: "#",
                logoUrl: "https://i.ibb.co/4wvZ1Mzq/ND-Radio-transparent.png",
                imageKey: "ndRadio",
            }
        ]
    },
    {
        category: "Business Development & Innovation",
        id: "business-development-innovation",
        icon: Briefcase,
        subsidiaries: [
            {
                name: "Blaque Tech",
                description: "Technology and Innovation Labs that helps create and build MVPs for idea makers for free.",
                link: "https://blaque.tech",
                logoUrl: "https://i.ibb.co/r2QMqgJG/Blaque-Tech.png",
                imageKey: "blaqueTech",
            },
             {
                name: "Qreatv Branding Agency",
                description: "Artist development and branding to help creators build a powerful market presence.",
                link: "https://Qreatv.Agency",
                imageKey: "qreatv",
            }
        ]
    },
    {
        category: "Education & Artist Development",
        id: "education-artist-development",
        icon: GraduationCap,
        subsidiaries: [
            {
                name: "Music Industry University",
                description: "An educational platform offering expert-led courses on the new music economy.",
                link: "https://musicindustry.university",
                logoUrl: "https://i.ibb.co/sJV522gj/miu-logo.png",
                imageKey: "miu",
            },
            {
                name: "Music Focus Group",
                description: "Provides structured, data-driven feedback on music from real listeners to help artists refine their tracks.",
                link: "https://musicfocus.group",
                logoUrl: "https://i.ibb.co/tPDWyjWd/Screenshot-2025-07-25-at-10-01-10-AM.png",
                imageKey: "mfg",
            },
             {
                name: "Inner View Podcasts",
                description: "Podcasts dedicated to indie music and recording artists.",
                link: "#",
                imageKey: "innerView",
            }
        ]
    },
    {
        category: "Community & Networking",
        id: "community-networking",
        icon: Group,
        subsidiaries: [
            {
                name: "The INDIE ARTIST NETWORK",
                description: "The heart of the community, offering news, resources, and forums specifically for IMG artists.",
                link: "https://IndieArtist.Network",
                logoUrl: "https://i.ibb.co/TxdMLzg6/Screenshot-2025-07-27-at-11-09-18-AM.png",
                imageKey: "ian",
            },
            {
                name: "ProFile Share",
                description: "A profile showcasing platform for secure file sharing of demos and press kits.",
                link: "https://Share.VNDRmusic.com",
                imageKey: "proFileShare"
            }
        ]
    },
    {
        category: "News & Media",
        id: "news-media",
        icon: BookOpen,
        subsidiaries: [
             {
                name: "Indie Music News",
                description: "An independent journalism hub focused on the indie music scene.",
                link: "#",
                imageKey: "indieNews",
            }
        ]
    },
];

export function EcosystemClient() {
  return (
    <div className="space-y-12 py-8">
       <header className="text-center">
        <Network className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">The VSD Network Ecosystem</h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          A growing network of AI tools, dApps, and partner platforms integrated with the VSD utility token, all part of the Independent Media Group (IMG).
        </p>
      </header>

      {imgEcosystem.map(category => (
        <React.Fragment key={category.id}>
            <Separator />
            <section id={category.id} className="space-y-8">
                 <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-center flex items-center justify-center gap-3">
                    <category.icon className="h-8 w-8 text-primary" />
                    {category.category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {category.subsidiaries.map(sub => {
                      const image = imageData.ecosystem[sub.imageKey];
                      // Safety check: if image data doesn't exist, skip rendering this card
                      if (!image) {
                        console.warn(`Missing image data for key: ${sub.imageKey}`);
                        return null;
                      }
                      return (
                        <Card key={sub.name} className="flex flex-col shadow-lg bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="aspect-video relative mb-4">
                                    <AIImage
                                        initialSrc={`${image.src}?v=3`}
                                        alt={`Cover art for ${sub.name}`}
                                        width={600}
                                        height={400}
                                        className="rounded-t-lg object-cover"
                                        hint={image.hint}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority={false}
                                    />
                                    {sub.logoUrl && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8">
                                             <div className="relative h-24 w-full">
                                                <Image
                                                    src={`${sub.logoUrl}?v=3`}
                                                    alt={`${sub.name} Logo`}
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                    className="drop-shadow-lg"
                                                    unoptimized
                                                    onError={(e) => {
                                                        // Silently handle image errors
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="font-headline text-xl sm:text-2xl">{sub.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{sub.description}</CardDescription>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full btn-hover-effect" size="lg" variant="outline">
                                    <Link href={sub.link} target="_blank" rel="noopener noreferrer">
                                        Visit Site <ArrowUpRightSquare className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                      )
                    })}
                </div>
            </section>
        </React.Fragment>
      ))}
    </div>
  );
}
