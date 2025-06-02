import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <div className="relative bg-purple-900 text-white">
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Encontre Eventos Cristãos que Fortalecem sua Fé
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Conecte-se com a comunidade cristã através de conferências, retiros, shows e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/events">
              <Button className="bg-purple-600 text-white hover:bg-purple-700 h-11 rounded-md px-8">
                Explorar Eventos
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-purple-100 text-purple-900 hover:bg-purple-200 h-11 rounded-md px-8">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
