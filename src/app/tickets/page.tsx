import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { TicketsClient } from './tickets-client';

export const metadata: Metadata = {
  title: 'Meus Ingressos - Ictus',
  description: 'Visualize seus ingressos para eventos cristãos.',
};

export default function TicketsPage() {
  return (
    <MainLayout>
      <TicketsClient />
    </MainLayout>
  );
}
