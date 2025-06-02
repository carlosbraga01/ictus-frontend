import { ApiResponse } from '@/types';
import apiClient from './client';

// Ticket interfaces based on the API
export interface Ticket {
  id: number;
  codigo: string;
  status: 'valid' | 'used' | 'cancelled';
  pedido_id: number;
  lote_id: number;
  usuario_id: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  usuario_id: number;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
  updated_at: string;
  tickets?: Ticket[];
}

export interface Payment {
  id: number;
  pedido_id: number;
  metodo: 'cartao' | 'pix' | 'boleto';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  valor: number;
  data_pagamento?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  lote_id: number;
  quantidade: number;
}

export interface CreatePaymentRequest {
  pedido_id: number;
  metodo: 'cartao' | 'pix' | 'boleto';
}

export interface TicketValidationResult {
  valid: boolean;
  ticket?: Ticket;
  message: string;
}

const ticketsApi = {
  /**
   * Get ticket by ID
   */
  getTicket: async (id: number): Promise<ApiResponse<Ticket>> => {
    try {
      const response = await apiClient.get(`/tickets/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: 'Ticket obtido com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: null as unknown as Ticket,
        message: axiosError.response?.data?.message || 'Erro ao obter ticket'
      };
    }
  },

  /**
   * Validate a ticket by code
   */
  validateTicket: async (codigo: string): Promise<ApiResponse<TicketValidationResult>> => {
    try {
      const response = await apiClient.post('/tickets/validate', { codigo });
      return {
        success: true,
        data: response.data.data,
        message: 'Ticket validado com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: { valid: false, message: axiosError.response?.data?.message || 'Ticket inválido' },
        message: axiosError.response?.data?.message || 'Erro ao validar ticket'
      };
    }
  },

  /**
   * Create an order (purchase tickets)
   */
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    try {
      const response = await apiClient.post('/tickets/orders', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Pedido criado com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: null as unknown as Order,
        message: axiosError.response?.data?.message || 'Erro ao criar pedido'
      };
    }
  },

  /**
   * Get order by ID
   */
  getOrder: async (id: number): Promise<ApiResponse<Order>> => {
    try {
      const response = await apiClient.get(`/tickets/orders/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: 'Pedido obtido com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: null as unknown as Order,
        message: axiosError.response?.data?.message || 'Erro ao obter pedido'
      };
    }
  },

  /**
   * Get user's orders
   */
  getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
    try {
      const response = await apiClient.get('/tickets/orders');
      return {
        success: true,
        data: response.data.data,
        message: 'Pedidos obtidos com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: [],
        message: axiosError.response?.data?.message || 'Erro ao obter pedidos'
      };
    }
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (id: number): Promise<ApiResponse<Order>> => {
    try {
      const response = await apiClient.put(`/tickets/orders/${id}/cancel`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Pedido cancelado com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: null as unknown as Order,
        message: axiosError.response?.data?.message || 'Erro ao cancelar pedido'
      };
    }
  },

  /**
   * Get tickets by order ID
   */
  getTicketsByOrder: async (orderId: number): Promise<ApiResponse<Ticket[]>> => {
    try {
      const response = await apiClient.get(`/tickets/orders/${orderId}/tickets`);
      return {
        success: true,
        data: response.data.data,
        message: 'Tickets obtidos com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: [],
        message: axiosError.response?.data?.message || 'Erro ao obter tickets'
      };
    }
  },

  /**
   * Create a payment for an order
   */
  createPayment: async (data: CreatePaymentRequest): Promise<ApiResponse<Payment>> => {
    try {
      const response = await apiClient.post('/tickets/payments', data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Pagamento iniciado com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: null as unknown as Payment,
        message: axiosError.response?.data?.message || 'Erro ao criar pagamento'
      };
    }
  },

  /**
   * Get payment by ID
   */
  getPayment: async (id: number): Promise<ApiResponse<Payment>> => {
    try {
      const response = await apiClient.get(`/tickets/payments/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: 'Pagamento obtido com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: null as unknown as Payment,
        message: axiosError.response?.data?.message || 'Erro ao obter pagamento'
      };
    }
  },

  /**
   * Get payments for an order
   */
  getPaymentsByOrder: async (orderId: number): Promise<ApiResponse<Payment[]>> => {
    try {
      const response = await apiClient.get(`/tickets/orders/${orderId}/payments`);
      return {
        success: true,
        data: response.data.data,
        message: 'Pagamentos obtidos com sucesso'
      };
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: [],
        message: axiosError.response?.data?.message || 'Erro ao obter pagamentos'
      };
    }
  },
  
  /**
   * Get user's tickets with optional filtering by status
   */
  getUserTickets: async (params?: { status?: 'valid' | 'used' | 'cancelled' }): Promise<ApiResponse<{ tickets: any[], total: number }>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) {
        queryParams.append('status', params.status);
      }
      
      const url = `/tickets/my-tickets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      
      return {
        success: true,
        data: {
          tickets: response.data.data.map((ticket: any) => ({
            id: ticket.id,
            eventId: ticket.evento_id,
            event: ticket.evento ? {
              id: ticket.evento.id,
              title: ticket.evento.nome,
              date: ticket.evento.data_inicio,
              time: new Date(ticket.evento.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              location: ticket.evento.local,
              imageUrl: ticket.evento.banner_url || '/images/event-placeholder.jpg'
            } : undefined,
            userId: ticket.usuario_id,
            status: ticket.status,
            ticketType: ticket.lote?.nome || 'Ingresso Padrão',
            price: ticket.lote?.preco || 0,
            quantity: 1,
            purchaseDate: ticket.created_at,
            code: ticket.codigo
          })),
          total: response.data.meta?.total || response.data.data.length
        },
        message: 'Ingressos obtidos com sucesso'
      };
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        data: { tickets: [], total: 0 },
        message: axiosError.response?.data?.message || 'Erro ao obter ingressos'
      };
    }
  }
};

// Re-export the ticketsApi for use in other modules
export { ticketsApi };
export default ticketsApi;
