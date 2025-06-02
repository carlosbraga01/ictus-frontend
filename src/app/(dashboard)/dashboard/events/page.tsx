import { Metadata } from 'next';
import { EventsManagementClient } from './events-management-client';

export const metadata: Metadata = {
  title: 'Gerenciar Eventos - Ictus',
  description: 'Gerencie seus eventos cristãos na plataforma Ictus.',
};

export default function EventsManagementPage() {
  return <EventsManagementClient />;
}
