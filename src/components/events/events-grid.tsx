import { Event } from '@/types';
import { EventCard } from './event-card';

interface EventsGridProps {
  events: Event[];
  emptyMessage?: string;
}

export function EventsGrid({ events, emptyMessage = "Nenhum evento encontrado" }: EventsGridProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
