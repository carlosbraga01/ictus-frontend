import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Recuperar Senha - Ictus',
  description: 'Recupere sua senha para acessar sua conta Ictus.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
