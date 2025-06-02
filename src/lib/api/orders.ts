import { ApiResponse, CartItem, Order } from '@/types';
import apiClient from './client';

interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'cancelled';
}

interface CreateOrderData {
  items: CartItem[];
  paymentMethod: string;
}

export const ordersApi = {
  getUserOrders: async (params: OrdersQueryParams = {}): Promise<ApiResponse<{ orders: Order[]; total: number; pages: number }>> => {
    const response = await apiClient.get<ApiResponse<{ orders: Order[]; total: number; pages: number }>>('/orders/user', { params });
    return response.data;
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderData): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  cancelOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data;
  },

  processPayment: async (orderId: string, paymentData: any): Promise<ApiResponse<{ paymentId: string; status: string }>> => {
    const response = await apiClient.post<ApiResponse<{ paymentId: string; status: string }>>(`/orders/${orderId}/payment`, paymentData);
    return response.data;
  },
};
