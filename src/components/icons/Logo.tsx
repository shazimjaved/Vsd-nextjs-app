'use client';

import Image from 'next/image';
import type { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface LogoProps extends Omit<ImageProps, 'src' | 'alt'> {
  size?: number;
}

// Use external logo URL
const originalLogoUrl = 'https://i.ibb.co/Kpg55CcY/Adobe-Express-20250422-1254090-1.png';

// Fallback SVG logo as data URI - only used if original fails
// Create fallback SVG with correct "VSD" text
const createFallbackLogo = (): string => {
  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#007cff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#005db3;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#grad)"/>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">VSD</text>
  </svg>`;
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const fallbackLogo = createFallbackLogo();

export function Logo({ size = 30, className, ...props }: LogoProps) {
  const [imgSrc, setImgSrc] = useState(originalLogoUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackLogo);
      // Silently handle 404 - don't spam console with errors
      console.warn('VSD Logo: Original image not found, using fallback. Please update the logo URL in src/components/icons/Logo.tsx');
    }
  };

  return (
    <Image
      src={imgSrc}
      alt="Audio Exchange Logo"
      width={size}
      height={size}
      className={cn(className)}
      priority={props.priority !== false} // Good for LCP elements like header logo
      unoptimized // Force unoptimized to bypass Next.js image cache
      onError={handleError}
      {...props}
    />
  );
}
