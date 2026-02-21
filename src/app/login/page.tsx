
import type { Metadata } from 'next';
import { LoginClient } from '@/components/auth/LoginClient';

export const metadata: Metadata = {
  title: 'Login | VSD Network',
  description: 'Sign in to your VSD Network account to access your dashboard, manage tokens, and use exclusive AI services.',
};

export default function LoginPage() {
  return <LoginClient />;
}
