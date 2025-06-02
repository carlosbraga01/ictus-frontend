import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <div className="flex-1 flex">
        <DashboardNav />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
