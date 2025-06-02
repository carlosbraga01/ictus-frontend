'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Evento, EventoDetalhado } from '@/types';
import { eventosApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/utils/cart-context';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, Clock, MapPin, User, Tag, Share2, Heart } from 'lucide-react';

interface EventDetailClientProps {
  eventId: string;
}

export function EventDetailClient({ eventId }: EventDetailClientProps) {
  const [event, setEvent] = useState<EventoDetalhado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await eventosApi.obterEvento(parseInt(eventId));
        setEvent(response.data);
        
        // Check if event is in favorites (this would be implemented with a real API)
        // setIsFavorite(checkIfFavorite(eventId));
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes do evento.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId, toast]);
  
  const handleAddToCart = () => {
    if (!event) return;
    
    if (!isAuthenticated) {
      toast({
        title: 'Autenticação necessária',
        description: 'Você precisa estar logado para comprar ingressos.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }
    
    // Convert the Evento object to the format expected by addItem
    const cartEvent = {
      id: event.id.toString(),
      title: event.nome,
      description: event.descricao,
      date: event.data_inicio,
      time: new Date(event.data_inicio).toLocaleTimeString(),
      location: event.local,
      imageUrl: event.banner_url || '/images/event-placeholder.jpg',
      price: 0, // Add price if available in your data model
      organizerId: event.organizador_id.toString()
    };
    
    addItem(cartEvent, quantity, 'standard');
    
    toast({
      title: 'Adicionado ao carrinho',
      description: `${quantity} ingresso(s) para ${event.nome} adicionado(s) ao carrinho.`,
      variant: 'success',
    });
  };
  
  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.nome || 'Evento Ictus',
        text: event?.descricao || 'Confira este evento na plataforma Ictus!',
        url: window.location.href,
      })
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copiado',
        description: 'O link do evento foi copiado para a área de transferência.',
      });
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      description: isFavorite 
        ? 'Este evento foi removido dos seus favoritos.' 
        : 'Este evento foi adicionado aos seus favoritos.',
    });
    
    // This would call an API to save the favorite status
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-80 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Evento não encontrado</h1>
          <p className="text-gray-600 mb-8">
            O evento que você está procurando não existe ou foi removido.
          </p>
          <Link href="/events">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Ver todos os eventos
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Event Image */}
        <div className="relative h-80 md:h-96 w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={event.banner_url || '/images/event-placeholder.jpg'}
            alt={event.nome}
            fill
            className="object-cover"
          />
          {event.is_published && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Publicado
            </div>
          )}
        </div>
        
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.nome}</h1>
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>Organizado por {event.organizador?.nome || 'Organizador'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShareEvent}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Compartilhar evento"
              >
                <Share2 className="h-5 w-5 text-gray-700" />
              </button>
              
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full ${
                  isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors`}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full mb-4">
            Evento
          </div>
        </div>
        
        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sobre o Evento</h2>
              <p>{event.description}</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Detalhes</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Data</p>
                      <p className="text-gray-600">{formatDate(event.date, 'PPP')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Horário</p>
                      <p className="text-gray-600">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Local</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Purchase Card */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Ingressos</h3>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-1">Preço por ingresso</p>
                <p className="text-3xl font-bold text-purple-700">{formatCurrency(event.price)}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Quantidade</p>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-l"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="bg-gray-100 py-2 px-4">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-r"
                    disabled={quantity >= 10 || quantity >= event.availableTickets}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>{formatCurrency(event.price * quantity)}</span>
                </div>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="w-full bg-purple-600 text-white hover:bg-purple-700 mb-3"
                disabled={event.availableTickets < 1}
              >
                {event.availableTickets < 1 ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                {event.availableTickets > 0 
                  ? `${event.availableTickets} ingressos disponíveis` 
                  : 'Ingressos esgotados'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
