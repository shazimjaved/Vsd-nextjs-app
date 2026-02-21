
"use client";

import Image, { type ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Fallback SVG placeholder for when external images fail
const createFallbackImage = (width: number, height: number): string => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#007cff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#005db3;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">VSD</text>
  </svg>`;
  // Browser-compatible base64 encoding
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }
  // Fallback for SSR (shouldn't happen in client component, but just in case)
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

interface AIImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  hint: string;
  alt: string;
  initialSrc: string; // Placeholder or fallback image URL
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean; // Use fill instead of layout="fill"
  style?: React.CSSProperties; // For objectFit and other styles
}

// This function securely calls our backend API route to generate an image.
async function generateImageViaApi(hint: string, timeout: number = 10000): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hint }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorResult = await response.json().catch(() => ({ error: 'Failed to generate image' }));
            throw new Error(errorResult.error || 'Failed to generate image via API.');
        }

        const result = await response.json();
        return result.imageDataUri;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Image generation timed out');
        }
        throw error;
    }
}


export function AIImage({
  hint,
  alt,
  initialSrc,
  width,
  height,
  className,
  priority,
  fill,
  style,
  ...props
}: AIImageProps) {
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(initialSrc);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasImageError, setHasImageError] = useState<boolean>(false);
  const [initialImageLoaded, setInitialImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Show initialSrc immediately, then try to generate AI image in background
    const generateImage = async () => {
      if (!hint) {
        setIsLoading(false);
        return;
      }

      // Try to generate AI image in background (don't block initial image display)
      try {
        const generatedImageUri = await generateImageViaApi(hint);
        if (isMounted && generatedImageUri) {
          setCurrentImageSrc(generatedImageUri);
          setError(null);
        }
      } catch (err: any) {
        // Silently fail - keep using initialSrc
        if (isMounted) {
          const errorMessage = err.message || 'An unknown error occurred during image generation.';
          // Only log if it's not a configuration error (403/503)
          if (!errorMessage.includes('not configured') && !errorMessage.includes('authentication')) {
            console.warn("AI_IMAGE_EXCEPTION: Image generation failed, using placeholder.", {
              hint,
              error: errorMessage,
            });
          }
          setError(errorMessage);
          // Keep using initialSrc - don't change it
          setIsLoading(false); // Stop loading since we're using placeholder
        }
      }
    };

    // Start AI generation in background
    generateImage();

    return () => {
      isMounted = false;
    };
  }, [hint, initialSrc]);

  const isDataUri = currentImageSrc.startsWith('data:');

  const imageWidth = fill ? undefined : width;
  const imageHeight = fill ? undefined : height;
  const fallbackDimensions = { width: width || 600, height: height || 400 };

  // If initial image hasn't loaded and we're still loading, show skeleton
  if (isLoading && !initialImageLoaded && !hasImageError) {
    if (fill) {
      return (
        <div className={cn("relative h-full w-full", className)}>
          <Skeleton className="absolute inset-0 h-full w-full" />
        </div>
      );
    }
    return <Skeleton className={cn("h-full w-full", className)} style={{width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%'}} />;
  }

  return (
    <Image
      src={currentImageSrc}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      fill={fill}
      className={cn("transition-opacity duration-500", className)}
      style={style}
      priority={priority}
      unoptimized={isDataUri || currentImageSrc.startsWith('http')} // Unoptimize external URLs and data URIs
      data-ai-hint={hint}
      onLoad={() => {
        setIsLoading(false);
        setInitialImageLoaded(true);
      }}
      onError={() => {
        if (!hasImageError) {
          console.warn(`AIImage: Error loading image source: ${currentImageSrc}. Using fallback.`);
          setHasImageError(true);
          setIsLoading(false);
          // Use fallback SVG if image fails to load
          setCurrentImageSrc(createFallbackImage(fallbackDimensions.width, fallbackDimensions.height));
          setError('Image source failed to load, using fallback.');
        }
      }}
      {...props}
    />
  );
}
