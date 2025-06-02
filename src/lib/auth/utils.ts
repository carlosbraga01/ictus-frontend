import { jwtDecode } from 'jwt-decode';
import { User } from '@/types';

interface DecodedToken {
  sub: string;
  name?: string;
  nome?: string;
  email: string;
  // Allow both uppercase and lowercase role values
  role: string;
  roles?: string[];
  exp: number;
  iat: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // If we can't decode the token, consider it expired
    return true;
  }
};

export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: parseInt(decoded.sub) || 0,
      nome: decoded.name || decoded.nome || decoded.email.split('@')[0],
      email: decoded.email,
      roles: [decoded.role.toUpperCase()],
      is_active: true,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('ictus_token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('ictus_token', token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('ictus_token');
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }
  return !isTokenExpired(token);
};

export const hasRole = (role: 'user' | 'organizer' | 'admin'): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  try {
    const user = getUserFromToken(token);
    if (!user) {
      return false;
    }
    
    if (role === 'admin') {
      return user.roles.includes('ADMIN');
    }
    
    if (role === 'organizer') {
      return user.roles.includes('ADMIN') || user.roles.includes('ORGANIZER');
    }
    
    return true; // All authenticated users have at least 'user' role
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // If there's an error checking roles, deny access
    return false;
  }
};
