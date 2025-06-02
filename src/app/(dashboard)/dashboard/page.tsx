import { Metadata } from 'next';
import { DashboardClient } from './dashboard-client';

export const metadata: Metadata = {
  title: 'Dashboard - Ictus',
  description: 'Painel de controle para organizadores de eventos cristãos.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
