// User types
export interface User {
  id: number;
  nome: string;
  email: string;
  roles: string[];
  is_active: boolean;
  created_at: string;
}

// User minimal response (for organizer info)
export interface UserMinimal {
  id: number;
  nome: string;
  email: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Authentication request types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  confirmar_senha: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  nova_senha: string;
  confirmar_senha: string;
}

// Token response
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Event types
export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local: string;
  slug: string;
  banner_url: string | null;
  organizador_id: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventoDetalhado extends Evento {
  organizador: UserMinimal;
}

export interface EventoCreate {
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local: string;
}

export interface EventoUpdate {
  nome?: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  local?: string;
  is_published?: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Ticket types
export interface Ticket {
  id: number;
  eventId: number;
  event?: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    imageUrl: string;
  };
  userId: number;
  status: 'valid' | 'used' | 'cancelled';
  ticketType: string;
  price: number;
  quantity: number;
  purchaseDate: string;
  code: string;
}

export interface TicketsResponse {
  tickets: Ticket[];
  total: number;
}
