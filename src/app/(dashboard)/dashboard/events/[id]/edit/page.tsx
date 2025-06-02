import { Metadata } from 'next';
import { EditEventClient } from './edit-event-client';

export const metadata: Metadata = {
  title: 'Editar Evento - Ictus',
  description: 'Edite as informações do seu evento cristão na plataforma Ictus.',
};

export default function EditEventPage({ params }: { params: { id: string } }) {
  return <EditEventClient eventId={params.id} />;
}
