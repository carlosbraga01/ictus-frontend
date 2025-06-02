'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { User, Bell, Menu, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-purple-700 text-white sticky top-0 z-30 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image 
                  src="/logo.png" 
                  alt="Ictus" 
                  width={120} 
                  height={40} 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden ml-4 text-white hover:text-purple-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-purple-200">
              Ver Site
            </Link>
            
            <button className="text-white hover:text-purple-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="relative ml-3" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center focus:outline-none"
              >
                <div className="bg-purple-800 rounded-full p-1">
                  <User className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-white font-medium">
                  {user?.nome ? user.nome.split(' ')[0] : 'Usuário'}
                </span>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button 
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      // Redirect to home page after logout
                      router.push('/');
                    }} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 cursor-pointer"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-800 border-b border-purple-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Ver Site
            </Link>
            
            <Link 
              href="/profile" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Meu Perfil
            </Link>
            
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-700"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
