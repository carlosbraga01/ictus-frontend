import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { CheckoutClient } from './checkout-client';

export const metadata: Metadata = {
  title: 'Checkout - Ictus',
  description: 'Finalize sua compra de ingressos para eventos cristãos.',
};

export default function CheckoutPage() {
  return (
    <MainLayout>
      <CheckoutClient />
    </MainLayout>
  );
}
