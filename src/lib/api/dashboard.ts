import { ApiResponse, Evento } from '@/types';
import apiClient from './client';
import { Order, Payment, Ticket, ticketsApi } from './tickets';

// Define the dashboard data types based on the API response
export interface DashboardStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalAttendees: number;
}
export interface UpcomingEvent extends Evento {
  ticketsSold?: number;
}

// Align with the new API structure for transactions
export interface RecentTransaction {
  id: number;
  evento_id: number;
  evento_nome: string;
  usuario_id: number;
  usuario_nome: string;
  data_pagamento: string;
  valor: number;
  status: string;
  metodo_pagamento: string;
}

export interface AnalyticsData {
  faixas_etarias: {
    [key: string]: number;
  };
  tendencias_ingressos: {
    diario: number[];
    semanal: number[];
    mensal: number[];
  };
  eventos_populares: {
    id: number;
    nome: string;
    ingressos_vendidos: number;
  }[];
}

export interface DashboardData {
  stats: DashboardStats;
  proximos_eventos: UpcomingEvent[];
  transacoes_recentes: RecentTransaction[];
  analytics: AnalyticsData;
  tickets_recentes?: Ticket[];
  pedidos_recentes?: Order[];
  pagamentos_recentes?: Payment[];
}

export const dashboardApi = {
  /**
   * Get dashboard data
   * Requires ADMIN or ORGANIZER role
   */
  getDashboardData: async (): Promise<ApiResponse<DashboardData>> => {
    try {
      // Log the request for debugging
      console.log('Making dashboard API request');
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.error('Not in browser environment, cannot access localStorage');
        throw new Error('Not in browser environment');
      }
      
      // Get the auth token
      const token = localStorage.getItem('ictus_token');
      console.log('Token exists:', !!token); // Log if token exists without exposing the actual token
      
      if (!token) {
        console.error('Authentication token not found');
        throw new Error('Token not found. Please log in again.');
      }
      
      // Set the authorization header explicitly
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header set');
      
      // Log the full request configuration for debugging
      console.log('API client baseURL:', apiClient.defaults.baseURL);
      console.log('API request headers:', apiClient.defaults.headers);
      
      // Make the API request
      console.log('Sending request to /dashboard endpoint');
      const response = await apiClient.get('/dashboard/');
      
      // Log the raw response for debugging
      console.log('Raw dashboard API response status:', response.status);
      console.log('Raw dashboard API response data:', response.data);
      
      // For now, since the dashboard endpoint might not be fully implemented in the API,
      // we'll return mock data that matches the new schema
      const mockData: DashboardData = {
        stats: {
          totalEvents: 5,
          totalTicketsSold: 120,
          totalRevenue: 6000,
          totalAttendees: 110
        },
        proximos_eventos: [],
        transacoes_recentes: [],
        analytics: {
          faixas_etarias: {
            '18-24': 30,
            '25-34': 45,
            '35-44': 20,
            '45+': 5
          },
          tendencias_ingressos: {
            diario: [5, 8, 12, 10, 15, 20, 18],
            semanal: [30, 45, 60, 75, 65],
            mensal: [120, 150, 180, 210, 190, 220]
          },
          eventos_populares: [
            { id: 1, nome: 'Evento 1', ingressos_vendidos: 45 },
            { id: 2, nome: 'Evento 2', ingressos_vendidos: 35 },
            { id: 3, nome: 'Evento 3', ingressos_vendidos: 25 }
          ]
        },
        tickets_recentes: [],
        pedidos_recentes: [],
        pagamentos_recentes: []
      };
      
      // Try to use real data if available, otherwise use mock data
      if (response.data && typeof response.data === 'object') {
        return {
          success: true,
          message: 'Dados do dashboard obtidos com sucesso',
          data: response.data.data || response.data
        };
      } else {
        return {
          success: true,
          message: 'Dados do dashboard obtidos com sucesso (mock)',
          data: mockData
        };
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Type guard for error with response property
      type ErrorWithResponse = {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
        message?: string;
      };
      
      // Check if error has a response property in a type-safe way
      const isErrorWithResponse = (err: unknown): err is ErrorWithResponse => {
        return err !== null && typeof err === 'object' && 'response' in err;
      };
      
      if (isErrorWithResponse(error)) {
        console.error('Error details:', error.response?.data || error.message);
      }
      
      // Create a standardized error response
      return {
        success: false,
        message: isErrorWithResponse(error)
          ? error.response?.data?.detail || error.response?.data?.message || error.message || 'Não foi possível carregar os dados do dashboard'
          : 'Não foi possível carregar os dados do dashboard',
        data: null as DashboardData
      };
    }
  },
  
  /**
   * Get user tickets dashboard
   * Shows tickets purchased by the current user
   */
  getUserTicketsDashboard: async (): Promise<ApiResponse<{
    tickets: Ticket[];
    orders: Order[];
    payments: Payment[];
  }>> => {
    try {
      // Get user orders using the ticketsApi
      const ordersResponse = await ticketsApi.getUserOrders();
      
      // Get all tickets from all orders
      const orders = ordersResponse.success ? ordersResponse.data : [];
      let allTickets: Ticket[] = [];
      let allPayments: Payment[] = [];
      
      // For each order, get its tickets and payments using the ticketsApi
      for (const order of orders) {
        try {
          const ticketsResponse = await ticketsApi.getTicketsByOrder(order.id);
          if (ticketsResponse.success && ticketsResponse.data) {
            allTickets = [...allTickets, ...ticketsResponse.data];
          }
          
          const paymentsResponse = await ticketsApi.getPaymentsByOrder(order.id);
          if (paymentsResponse.success && paymentsResponse.data) {
            allPayments = [...allPayments, ...paymentsResponse.data];
          }
        } catch (err) {
          console.error(`Error fetching details for order ${order.id}:`, err);
        }
      }
      
      return {
        success: true,
        message: 'Dados de ingressos obtidos com sucesso',
        data: {
          tickets: allTickets,
          orders,
          payments: allPayments
        }
      };
    } catch (error) {
      console.error('Error fetching user tickets dashboard:', error);
      
      return {
        success: false,
        message: 'Não foi possível carregar os dados de ingressos',
        data: {
          tickets: [],
          orders: [],
          payments: []
        }
      };
    }
  }
};
