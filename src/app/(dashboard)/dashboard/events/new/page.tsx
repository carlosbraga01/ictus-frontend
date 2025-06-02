import { Metadata } from 'next';
import { CreateEventClient } from './create-event-client';

export const metadata: Metadata = {
  title: 'Criar Evento - Ictus',
  description: 'Crie um novo evento cristão na plataforma Ictus.',
};

export default function CreateEventPage() {
  return <CreateEventClient />;
}
