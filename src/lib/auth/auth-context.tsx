'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User } from '@/types';
import { authApi } from '@/lib/api';
import { getToken, getUserFromToken, isTokenExpired, removeToken, setToken } from './utils';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'USER' | 'ORGANIZER';
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      
      if (!token) {
        setState({ ...initialState, isLoading: false });
        return;
      }
      
      if (isTokenExpired(token)) {
        removeToken();
        setState({ ...initialState, isLoading: false });
        return;
      }
      
      try {
        // Get the user from token initially
        const user = getUserFromToken(token);
        
        // Then fetch the full user data from the API
        const response = await authApi.getCurrentUser();
        
        setState({
          user: response.data,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        removeToken();
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to authenticate',
        });
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      // Make a direct fetch call to the API instead of using the authApi service
      const response = await fetch('https://ictus-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error response:', errorData);
        throw new Error(errorData.message || 'Failed to login');
      }
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      // Extract token and user data
      const token = data.token || data.accessToken || (data.data && data.data.token);
      
      if (!token) {
        console.error('No token found in response:', data);
        throw new Error('No authentication token received');
      }
      
      // Create a user object that matches the User interface
      const user = {
        id: data.id || (data.user && data.user.id) || 0,
        nome: data.nome || data.name || (data.user && (data.user.nome || data.user.name)) || email.split('@')[0],
        email: email,
        roles: [data.role || (data.user && data.user.role) || 'USER'],
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      console.log('Setting token:', token);
      setToken(token);
      
      console.log('Setting state with user:', user);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to login',
      });
      throw error;
    }
  };

  const register = async (registerData: { name: string; email: string; password: string; phone: string; role: string }) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      // Make a direct fetch call to the API instead of using the authApi service
      console.log('Sending registration data:', registerData);
      const response = await fetch('https://ictus-backend.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registerData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error response:', errorData);
        throw new Error(errorData.message || 'Failed to register');
      }
      
      const data = await response.json();
      console.log('Registration response data:', data);
      
      // Extract token and user data
      const token = data.token || data.accessToken || (data.data && data.data.token);
      
      if (!token) {
        console.error('No token found in registration response:', data);
        throw new Error('No authentication token received');
      }
      
      // Create a user object that matches the User interface
      const user = {
        id: data.id || (data.user && data.user.id) || 0,
        nome: registerData.name,
        email: registerData.email,
        roles: [registerData.role.toUpperCase()],
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      console.log('Setting token after registration:', token);
      setToken(token);
      
      console.log('Setting state with user after registration:', user);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to register',
      });
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const forgotPassword = async (email: string) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      await authApi.forgotPassword({ email });
      setState({ ...state, isLoading: false });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to process request',
      });
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      await authApi.resetPassword({ token, nova_senha: password, confirmar_senha: password });
      setState({ ...state, isLoading: false });
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to reset password',
      });
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
