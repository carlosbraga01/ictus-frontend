'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    // Function to decode JWT token
    const decodeToken = (token: string) => {
      try {
        // Split the token and get the payload part
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        console.log('Decoded JWT token payload:', JSON.stringify(decoded, null, 2));
        console.log('JWT token payload fields:', Object.keys(decoded));
        console.log('JWT token name fields:', {
          name: decoded.name,
          nome: decoded.nome,
          username: decoded.username,
          displayName: decoded.displayName
        });
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };

    // Function to check if the token is expired
    const isTokenExpired = (token: string): boolean => {
      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    };

    // Function to get user from token
    const getUserFromToken = (token: string): User | null => {
      const decoded = decodeToken(token);
      if (!decoded) return null;
      
      console.log('Decoded token for user extraction:', decoded);
      
      // Handle different possible formats of role/roles in the token
      let roles: string[] = [];
      
      if (decoded.role) {
        // Handle role as string
        if (typeof decoded.role === 'string') {
          roles = [decoded.role.toUpperCase()];
        } 
        // Handle role as array
        else if (Array.isArray(decoded.role)) {
          roles = decoded.role.map((r: string) => r.toUpperCase());
        }
      } 
      // Try roles (plural) if role is not present
      else if (decoded.roles) {
        // Handle roles as string
        if (typeof decoded.roles === 'string') {
          roles = [decoded.roles.toUpperCase()];
        } 
        // Handle roles as array
        else if (Array.isArray(decoded.roles)) {
          roles = decoded.roles.map((r: string) => r.toUpperCase());
        }
      }
      
      console.log('Extracted roles from token:', roles);
      
      // Extract user name from various possible fields in the token
      const extractName = (): string => {
        // Check all possible name fields in priority order
        const possibleNameFields = ['nome', 'name', 'username', 'displayName', 'given_name', 'firstName'];
        
        for (const field of possibleNameFields) {
          if (decoded[field] && typeof decoded[field] === 'string' && decoded[field].trim() !== '') {
            console.log(`Found name in field: ${field} = ${decoded[field]}`);
            return decoded[field];
          }
        }
        
        // If we have a full_name field, use that
        if (decoded.full_name || decoded.fullName) {
          return decoded.full_name || decoded.fullName;
        }
        
        // If we have first_name and last_name fields, combine them
        if ((decoded.first_name || decoded.firstName) && (decoded.last_name || decoded.lastName)) {
          return `${decoded.first_name || decoded.firstName} ${decoded.last_name || decoded.lastName}`;
        }
        
        console.warn('No name field found in token payload. Fields available:', Object.keys(decoded));
        return 'Usuário';
      };
      
      // Create user object with normalized data
      const user: User = {
        id: decoded.sub || decoded.id || 0,
        nome: extractName(),
        email: decoded.email || '',
        roles: roles,
        is_active: decoded.is_active !== false, // Default to true unless explicitly false
        created_at: decoded.created_at || new Date().toISOString()
      };
      
      console.log('Created user object:', user);
      return user;
    };

    // Initialize auth state
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('ictus_token');
        
        if (!token) {
          setState({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
          });
          return;
        }
        
        if (isTokenExpired(token)) {
          localStorage.removeItem('ictus_token');
          localStorage.removeItem('ictus_user');
          setState({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
          });
          return;
        }
        
        const user = getUserFromToken(token);
        console.log('User from token:', user);
        
        if (user) {
          // Store user in localStorage for easier access
          localStorage.setItem('ictus_user', JSON.stringify(user));
          
          setState({
            isAuthenticated: true,
            user,
            token,
            isLoading: false,
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
      }
    };
    
    initializeAuth();
  }, []);
  
  return state;
}
