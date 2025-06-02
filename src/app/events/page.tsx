import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { EventsListingClient } from './events-listing-client';

export const metadata: Metadata = {
  title: 'Eventos - Ictus',
  description: 'Explore eventos cristãos disponíveis na plataforma Ictus.',
};

export default function EventsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Eventos Cristãos</h1>
          <p className="text-lg text-gray-600">
            Explore eventos que fortalecem sua fé e promovem a comunhão cristã.
          </p>
        </div>
        
        <EventsListingClient />
      </div>
    </MainLayout>
  );
}
