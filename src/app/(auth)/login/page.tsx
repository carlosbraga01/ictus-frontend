import { Metadata } from 'next';
import { LoginForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Login - Ictus',
  description: 'Faça login na sua conta Ictus para acessar eventos cristãos.',
};

export default function LoginPage() {
  return <LoginForm />;
}
