
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'indiemedia.llc',
      },
       {
        protocol: 'https',
        hostname: 'placehold.co',
      },
       {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle genkit modules - they should only be used on the server
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@genkit-ai/google-genai': false,
        'genkit': false,
      };
    }
    return config;
  },
  // Ensure server components are properly marked
  serverExternalPackages: ['@genkit-ai/google-genai', 'genkit'],
};

export default nextConfig;
