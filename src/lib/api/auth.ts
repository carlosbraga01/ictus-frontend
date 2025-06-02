import { ApiResponse, User, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm, TokenResponse } from '@/types';
import apiClient from './client';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<TokenResponse>> => {
    try {
      console.log('Login credentials:', { ...credentials, password: '******' });
      
      // Create form data for login (API expects x-www-form-urlencoded)
      const formData = new URLSearchParams();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);
      
      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('Login raw response:', response);
      
      // Store the token in localStorage
      if (response.data.access_token) {
        localStorage.setItem('ictus_token', response.data.access_token);
      }
      
      // Return formatted response
      return {
        data: response.data,
        success: true,
        message: 'Login realizado com sucesso'
      };
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Error response:', (error as any).response?.data);
      }
      
      return {
        data: null as any,
        success: false,
        message: (error && typeof error === 'object' && 'response' in error) 
          ? (error as any).response?.data?.detail || 'Erro ao fazer login'
          : 'Erro ao fazer login'
      };
    }
  },

  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    try {      
      console.log('Sending registration data:', data);
      const response = await apiClient.post('/auth/register', data);
      console.log('Registration response:', response.data);
      
      return {
        data: response.data,
        success: true,
        message: 'Cadastro realizado com sucesso'
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      return {
        data: null as any,
        success: false,
        message: error.response?.data?.detail || 'Erro ao realizar cadastro'
      };
    }
  },

  forgotPassword: async (data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.post('/auth/forgot-password', data);
      return {
        data: { message: 'Email de recuperação enviado com sucesso' },
        success: true,
        message: 'Email de recuperação enviado com sucesso'
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        message: error.response?.data?.detail || 'Erro ao solicitar recuperação de senha'
      };
    }
  },

  resetPassword: async (data: PasswordResetConfirm): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.post('/auth/reset-password', data);
      return {
        data: { message: 'Senha alterada com sucesso' },
        success: true,
        message: 'Senha alterada com sucesso'
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        message: error.response?.data?.detail || 'Erro ao redefinir senha'
      };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get('/users/me');
      return {
        data: response.data,
        success: true,
        message: 'Dados do usuário obtidos com sucesso'
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        message: error.response?.data?.detail || 'Erro ao obter dados do usuário'
      };
    }
  },
};
