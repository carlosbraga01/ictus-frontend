'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Event } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (event: Event, quantity: number, ticketType: string) => void;
  removeItem: (eventId: string) => void;
  updateQuantity: (eventId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('ictus_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ictus_cart', JSON.stringify(items));
  }, [items]);
  
  const addItem = (event: Event, quantity: number, ticketType: string) => {
    setItems((prevItems) => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(item => item.eventId === event.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {
          eventId: event.id,
          event,
          quantity,
          ticketType,
          price: event.price,
        }];
      }
    });
  };
  
  const removeItem = (eventId: string) => {
    setItems((prevItems) => prevItems.filter(item => item.eventId !== eventId));
  };
  
  const updateQuantity = (eventId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(eventId);
      return;
    }
    
    setItems((prevItems) => 
      prevItems.map(item => 
        item.eventId === eventId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
