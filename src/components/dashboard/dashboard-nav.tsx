'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Users, 
  BarChart, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

function NavItem({ href, icon, title, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive 
          ? 'bg-purple-100 text-purple-900' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

export function DashboardNav() {
  const pathname = usePathname();
  
  const navItems = [
    {
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: 'Visão Geral',
    },
    {
      href: '/dashboard/events',
      icon: <Calendar className="h-5 w-5" />,
      title: 'Meus Eventos',
    },
    {
      href: '/dashboard/tickets',
      icon: <Ticket className="h-5 w-5" />,
      title: 'Ingressos',
    },
    {
      href: '/dashboard/attendees',
      icon: <Users className="h-5 w-5" />,
      title: 'Participantes',
    },
    {
      href: '/dashboard/analytics',
      icon: <BarChart className="h-5 w-5" />,
      title: 'Análises',
    },
    {
      href: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
      title: 'Configurações',
    },
  ];
  
  return (
    <nav className="hidden md:block w-64 bg-white border-r border-gray-200 p-6">
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            title={item.title}
            isActive={pathname === item.href}
          />
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t border-gray-200">
        <NavItem
          href="/dashboard/help"
          icon={<HelpCircle className="h-5 w-5" />}
          title="Ajuda & Suporte"
          isActive={pathname === '/dashboard/help'}
        />
      </div>
    </nav>
  );
}
