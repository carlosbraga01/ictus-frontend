'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/lib/hooks/use-auth-state';
import { dashboardApi } from '@/lib/api';
import { DashboardStats, UpcomingEvent, RecentTransaction, AnalyticsData } from '@/lib/dashboard';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';
import { 
  Calendar, 
  Ticket, 
  Users, 
  TrendingUp,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';

export function DashboardClient() {
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    totalAttendees: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  const { isAuthenticated, user } = useAuthState();
  console.log('Dashboard - Auth state:', { isAuthenticated, user });
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Dashboard auth check - User:', user);
      console.log('User roles in fetchDashboardData:', user?.roles);
      
      // Don't do any redirects here - we'll handle that with conditional rendering
      // Just return early if we can't fetch data
      if (!isAuthenticated || !user) {
        console.log('User not authenticated or user object missing. Skipping data fetch.');
        return;
      }
      
      console.log('User is authenticated and is an organizer. Loading dashboard...');
      
      try {
        setIsLoading(true);
        console.log('Fetching dashboard data from API...');
        
        // Use the dashboardApi to fetch data from the backend
        const response = await dashboardApi.getDashboardData();
        console.log('Dashboard data received:', response);
        
        if (response.success && response.data) {
          // Set upcoming events
          setUpcomingEvents(response.data.upcomingEvents || []);
          
          // Set stats
          setStats(response.data.stats || {
            totalEvents: 0,
            totalTicketsSold: 0,
            totalRevenue: 0,
            totalAttendees: 0,
          });
          
          // Set recent transactions
          setRecentTransactions(response.data.recentTransactions || []);
          
          // Set analytics data
          setAnalytics(response.data.analytics || null);
        } else {
          console.error('API returned unsuccessful response:', response);
          toast({
            title: 'Erro',
            description: response.message || 'Não foi possível carregar os dados do dashboard',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do dashboard.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAuthenticated, user, toast, router]);
  
  console.log("Current user object:", JSON.stringify(user, null, 2));
  console.log("User roles:", user?.roles);
  console.log("Is authenticated:", isAuthenticated);
  
  // Check if user has organizer role (case-insensitive)
  // Since we're already converting roles to uppercase in the auth state hook,
  // we can just check for 'ORGANIZER' directly
  const hasOrganizerRole = user?.roles?.includes('ORGANIZER');
  
  console.log("Has organizer role:", hasOrganizerRole);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-8">
            Você precisa estar logado como organizador para acessar o dashboard.
          </p>
          <Link href="/login">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // If authenticated but not an organizer, show access denied
  if (!hasOrganizerRole) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-8">
            Você está logado, mas não tem permissão de organizador para acessar o dashboard.
          </p>
          <Link href="/">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Link href="/dashboard/events/new">
          <Button className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Novo Evento
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 text-sm font-medium">Total de Eventos</h3>
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{stats.totalEvents}</p>
          <p className="text-sm text-gray-600 mt-2">Eventos criados por você</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 text-sm font-medium">Ingressos Vendidos</h3>
            <Ticket className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{stats.totalTicketsSold}</p>
          <p className="text-sm text-gray-600 mt-2">Em todos os eventos</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 text-sm font-medium">Receita Total</h3>
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-gray-600 mt-2">Em todos os eventos</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 text-sm font-medium">Participantes</h3>
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">{stats.totalAttendees}</p>
          <p className="text-sm text-gray-600 mt-2">Em todos os eventos</p>
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Próximos Eventos</h2>
          <Link href="/dashboard/events" className="text-purple-600 hover:text-purple-800 flex items-center font-medium">
            Ver Todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 h-16 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Você não tem eventos próximos.</p>
            <Link href="/dashboard/events/new">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Criar Novo Evento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border rounded-md p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(event.date, 'dd/MM/yyyy')}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{event.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">
                    {event.ticketsSold} ingressos vendidos
                  </span>
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                      Gerenciar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Transações Recentes</h2>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 h-16 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 font-medium">Nenhuma transação recente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-md p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{transaction.eventTitle}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{transaction.userName}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(transaction.purchaseDate).toLocaleDateString('pt-BR')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Analytics Section */}
      {analytics && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Análises</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Groups */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4 text-gray-800">Distribuição por Faixa Etária</h3>
              <div className="space-y-2">
                {analytics && Object.entries(analytics.ageGroups).map(([range, count]) => (
                  <div key={range} className="flex items-center">
                    <span className="text-sm text-gray-600 w-16">{range}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mx-2">
                      <div 
                        className="bg-purple-600 h-4 rounded-full" 
                        style={{ width: `${(count / Object.values(analytics.ageGroups).reduce((a: number, b: number) => a + b, 0)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Popular Events */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4 text-gray-800">Eventos Populares</h3>
              <div className="space-y-3">
                {analytics && analytics.popularEvents.map((event: {id: string, title: string, ticketsSold: number}) => (
                  <div key={event.id} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1 text-gray-700">{event.title}</span>
                    <span className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {event.ticketsSold} ingressos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
