'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/utils/cart-context';
import { useAuth } from '@/lib/auth';
import { ordersApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Trash2, Calendar, MapPin, Clock } from 'lucide-react';

export function CheckoutClient() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Autenticação Necessária</h1>
          <p className="text-gray-600 mb-8">
            Você precisa estar logado para acessar o checkout.
          </p>
          <Link href="/login">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // If cart is empty, show empty cart message
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Seu Carrinho está Vazio</h1>
          <p className="text-gray-600 mb-8">
            Você não tem nenhum ingresso no carrinho.
          </p>
          <Link href="/events">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Explorar Eventos
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Create order
      const response = await ordersApi.createOrder({
        items,
        paymentMethod,
      });
      
      // Process payment (in a real app, this would redirect to a payment gateway)
      const paymentResponse = await ordersApi.processPayment(response.data.id, {
        method: paymentMethod,
        // Additional payment details would go here
      });
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      toast({
        title: 'Pedido realizado com sucesso!',
        description: 'Seu pedido foi processado com sucesso.',
        variant: 'success',
      });
      
      // Redirect to order confirmation page
      router.push(`/orders/${response.data.id}`);
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: 'Erro ao processar pedido',
        description: 'Ocorreu um erro ao processar seu pedido. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Seu Carrinho</h2>
              
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.eventId} className="flex flex-col sm:flex-row gap-4 pb-6 border-b">
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={item.event.imageUrl || '/images/event-placeholder.jpg'}
                        alt={item.event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.event.title}</h3>
                        <button
                          onClick={() => removeItem(item.eventId)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1 mt-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(item.event.date, 'dd/MM/yyyy')}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{item.event.time}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{item.event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <span className="mr-2">Quantidade:</span>
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.eventId, parseInt(e.target.value))}
                            className="border rounded p-1"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-gray-600">{formatCurrency(item.price)} por ingresso</div>
                          <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de serviço</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="border-t pt-3 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Método de Pagamento</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="mr-2"
                    />
                    Cartão de Crédito
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="pix"
                      checked={paymentMethod === 'pix'}
                      onChange={() => setPaymentMethod('pix')}
                      className="mr-2"
                    />
                    PIX
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="boleto"
                      checked={paymentMethod === 'boleto'}
                      onChange={() => setPaymentMethod('boleto')}
                      className="mr-2"
                    />
                    Boleto Bancário
                  </label>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : 'Finalizar Compra'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Ao finalizar a compra, você concorda com nossos termos de serviço e política de privacidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
