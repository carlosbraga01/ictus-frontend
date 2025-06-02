import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { EventDetailClient } from './event-detail-client';

export const metadata: Metadata = {
  title: 'Detalhes do Evento - Ictus',
  description: 'Veja detalhes completos deste evento cristão.',
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <EventDetailClient eventId={params.id} />
    </MainLayout>
  );
}
