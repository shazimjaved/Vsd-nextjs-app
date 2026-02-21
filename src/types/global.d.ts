// Global type declarations

// Window.ethereum for Web3/MetaMask
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
    selectedAddress?: string;
  };
}

// Type declarations for modules without type definitions
declare module '@genkit-ai/google-genai' {
  export function googleAI(): any;
  export namespace googleAI {
    function model(modelName: string): any;
  }
}

// Framer Motion types are included in the package, but if missing:
declare module 'framer-motion' {
  import * as React from 'react';
  export interface MotionProps {
    [key: string]: any;
  }
  export const motion: {
    [key: string]: React.ComponentType<any>;
  };
  export function useAnimate(): any;
  export function animate(...args: any[]): any;
  export function useMotionValue<T>(initial: T): any;
  export function useSpring(source: any, config?: any): any;
  export const AnimatePresence: React.ComponentType<any>;
  export function useReducedMotion(): boolean;
}

