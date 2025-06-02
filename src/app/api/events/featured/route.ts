import { NextResponse } from 'next/server';

export async function GET() {
  // Mock featured events data
  const featuredEvents = [
    {
      id: '1',
      title: 'Conferência de Adoração',
      description: 'Uma noite especial de louvor e adoração com ministros de todo o Brasil.',
      date: '2025-06-15',
      time: '19:00',
      location: 'Igreja Batista Central, São Paulo',
      price: 50.00,
      category: 'Louvor',
      availableTickets: 200,
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop',
      isFeatured: true,
      tags: ['adoração', 'louvor', 'música'],
    },
    {
      id: '2',
      title: 'Retiro de Jovens 2025',
      description: 'Um final de semana para jovens se conectarem com Deus e fazerem novas amizades.',
      date: '2025-07-20',
      time: '08:00',
      location: 'Acampamento Luz e Vida, Campinas',
      price: 150.00,
      category: 'Retiros',
      availableTickets: 100,
      imageUrl: 'https://images.unsplash.com/photo-1523803326055-13445e1cf5e3?q=80&w=1470&auto=format&fit=crop',
      isFeatured: true,
      tags: ['jovens', 'retiro', 'comunhão'],
    },
    {
      id: '3',
      title: 'Estudo Bíblico Avançado',
      description: 'Série de estudos aprofundados sobre os livros proféticos do Antigo Testamento.',
      date: '2025-06-05',
      time: '19:30',
      location: 'Seminário Teológico Vida Nova, Rio de Janeiro',
      price: 30.00,
      category: 'Estudos',
      availableTickets: 50,
      imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1470&auto=format&fit=crop',
      isFeatured: true,
      tags: ['estudo', 'bíblia', 'profecia'],
    },
    {
      id: '4',
      title: 'Congresso de Liderança Cristã',
      description: 'Evento para capacitar líderes cristãos com ferramentas práticas para o ministério.',
      date: '2025-08-10',
      time: '09:00',
      location: 'Centro de Convenções, Belo Horizonte',
      price: 80.00,
      category: 'Conferências',
      availableTickets: 300,
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1469&auto=format&fit=crop',
      isFeatured: true,
      tags: ['liderança', 'ministério', 'capacitação'],
    }
  ];

  return NextResponse.json({ 
    success: true,
    events: featuredEvents 
  });
}
