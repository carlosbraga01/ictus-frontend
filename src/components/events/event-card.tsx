import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types';
import { formatDate, formatCurrency, truncateText } from '@/lib/utils';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={event.imageUrl || '/images/event-placeholder.jpg'}
          alt={event.title}
          fill
          className="object-cover"
        />
        {event.isFeatured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Destaque
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {event.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {truncateText(event.description, 100)}
        </p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(event.date, 'dd/MM/yyyy')}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="font-bold text-lg text-purple-700">
          {formatCurrency(event.price)}
        </div>
        
        <Link href={`/events/${event.id}`}>
          <Button variant="default" size="sm">
            Ver Detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
