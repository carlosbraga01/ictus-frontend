'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/utils/cart-context';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, ShoppingCart, User, ChevronDown } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Close the dropdown when clicking outside
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
    <header className="bg-purple-700 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Ictus" 
              width={120} 
              height={40} 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/events" className="text-white hover:text-purple-200 transition-colors">
              Eventos
            </Link>
            {isAuthenticated && (
              <Link href="/tickets" className="text-white hover:text-purple-200 transition-colors">
                Meus Ingressos
              </Link>
            )}
            {user?.roles?.includes('organizer') && (
              <Link href="/dashboard" className="text-white hover:text-purple-200 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-purple-200 transition-colors"
              aria-label="Pesquisar"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <Link href="/checkout" className="relative">
              <ShoppingCart className="h-5 w-5 text-white hover:text-purple-200 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  className="flex items-center space-x-2 text-white hover:text-purple-200 transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-5 w-5" />
                  <span>{user?.nome?.split(' ')[0] || 'Usuário'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link 
                      href="/tickets" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Meus Ingressos
                    </Link>
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
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Search Bar (conditionally rendered) */}
        {isSearchOpen && (
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Buscar eventos..."
              className="w-full p-2 pl-10 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 top-2.5 text-gray-500"
              aria-label="Fechar busca"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-purple-800 rounded-md p-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/events" 
                className="text-white hover:text-purple-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Eventos
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/tickets" 
                    className="text-white hover:text-purple-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Ingressos
                  </Link>
                  
                  <Link 
                    href="/profile" 
                    className="text-white hover:text-purple-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  
                  {user?.roles?.includes('organizer') && (
                    <Link 
                      href="/dashboard" 
                      className="text-white hover:text-purple-200 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }} 
                    className="text-white hover:text-purple-200 transition-colors text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="text-white hover:text-purple-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
              )}
              
              <Link 
                href="/checkout" 
                className="flex items-center justify-between text-white hover:text-purple-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Carrinho</span>
                {totalItems > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  className="w-full p-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
