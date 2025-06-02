import { ApiResponse, Evento, EventoDetalhado, EventoCreate, EventoUpdate } from '@/types';
import apiClient from './client';

interface EventosQueryParams {
  skip?: number;
  limit?: number;
  nome?: string;
  data_inicio?: string;
  data_fim?: string;
}

export const eventosApi = {
  /**
   * Listar todos os eventos publicados com filtros opcionais
   */
  listarEventos: async (params: EventosQueryParams = {}): Promise<ApiResponse<Evento[]>> => {
    try {
      const response = await apiClient.get('/events/', { params });
      return {
        data: response.data,
        success: true,
        message: 'Eventos obtidos com sucesso'
      };
    } catch (error: any) {
      return {
        data: [],
        success: false,
        message: error.response?.data?.detail || 'Erro ao obter eventos'
      };
    }
  },

  /**
   * Obter detalhes de um evento específico por ID
   */
  obterEvento: async (eventoId: number): Promise<ApiResponse<EventoDetalhado>> => {
    try {
      const response = await apiClient.get(`/events/${eventoId}`);
      return {
        data: response.data,
        success: true,
        message: 'Detalhes do evento obtidos com sucesso'
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        message: error.response?.data?.detail || 'Erro ao obter detalhes do evento'
      };
    }
  },

  /**
   * Listar eventos criados pelo usuário atual
   */
  listarMeusEventos: async (): Promise<ApiResponse<Evento[]>> => {
    try {
      const response = await apiClient.get('/events/meus-eventos');
      return {
        data: response.data,
        success: true,
        message: 'Seus eventos obtidos com sucesso'
      };
    } catch (error: any) {
      return {
        data: [],
        success: false,
        message: error.response?.data?.detail || 'Erro ao obter seus eventos'
      };
    }
  },

  /**
   * Listar eventos em que o usuário está inscrito
   */
  listarInscricoes: async (): Promise<ApiResponse<Evento[]>> => {
    try {
      const response = await apiClient.get('/events/inscricoes');
      return {
        data: response.data,
        success: true,
        message: 'Suas inscrições obtidas com sucesso'
      };
    } catch (error: any) {
      return {
        data: [],
        success: false,
        message: error.response?.data?.detail || 'Erro ao obter suas inscrições'
      };
    }
  },

  /**
   * Criar um novo evento
   */
  criarEvento: async (data: EventoCreate): Promise<ApiResponse<Evento>> => {
    try {
      const response = await apiClient.post('/events/', data);
      return {
        data: response.data,
        success: true,
        message: 'Evento criado com sucesso'
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        message: error.response?.data?.detail || 'Erro ao criar evento'
      };
    }
  },

  /**
   * Atualizar um evento existente
   */
  atualizarEvento: async (eventoId: number, data: EventoUpdate): Promise<ApiResponse<Evento>> => {
    try {
      const response = await apiClient.put(`/events/${eventoId}`, data);
      return {
        data: response.data,
        success: true,
        message: 'Evento atualizado com sucesso'
      };
    } catch (error: any) {
      return {
        data: null as any,
        success: false,
        message: error.response?.data?.detail || 'Erro ao atualizar evento'
      };
    }
  },

  /**
   * Excluir um evento
   */
  excluirEvento: async (eventoId: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`/events/${eventoId}`);
      return {
        data: undefined,
        success: true,
        message: 'Evento excluído com sucesso'
      };
    } catch (error: any) {
      return {
        data: undefined,
        success: false,
        message: error.response?.data?.detail || 'Erro ao excluir evento'
      };
    }
  },

  /**
   * Publicar um evento
   */
  publicarEvento: async (eventoId: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.post(`/events/${eventoId}/publicar`);
      return {
        data: undefined,
        success: true,
        message: 'Evento publicado com sucesso'
      };
    } catch (error: any) {
      return {
        data: undefined,
        success: false,
        message: error.response?.data?.detail || 'Erro ao publicar evento'
      };
    }
  },

  /**
   * Inscrever o usuário atual em um evento
   */
  inscreverEvento: async (eventoId: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.post(`/events/${eventoId}/inscrever`);
      return {
        data: undefined,
        success: true,
        message: 'Inscrição realizada com sucesso'
      };
    } catch (error: any) {
      return {
        data: undefined,
        success: false,
        message: error.response?.data?.detail || 'Erro ao realizar inscrição'
      };
    }
  },

  /**
   * Cancelar inscrição do usuário em um evento
   */
  cancelarInscricao: async (eventoId: number): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`/events/${eventoId}/cancelar`);
      return {
        data: undefined,
        success: true,
        message: 'Inscrição cancelada com sucesso'
      };
    } catch (error: any) {
      return {
        data: undefined,
        success: false,
        message: error.response?.data?.detail || 'Erro ao cancelar inscrição'
      };
    }
  },

  /**
   * Fazer upload de banner para um evento
   */
  uploadBanner: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/upload/upload-banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        data: response.data,
        success: true,
        message: 'Banner enviado com sucesso'
      };
    } catch (error: any) {
      return {
        data: { url: '' },
        success: false,
        message: error.response?.data?.detail || 'Erro ao enviar banner'
      };
    }
  }
};
