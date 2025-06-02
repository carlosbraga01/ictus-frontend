import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Registrar - Ictus',
  description: 'Crie sua conta Ictus para acessar eventos cristãos.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
