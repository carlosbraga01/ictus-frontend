import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <div className="bg-purple-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Crie Seu Próprio Evento</h2>
          <p className="text-xl text-purple-100 mb-8">
            Você é um organizador de eventos cristãos? Utilize nossa plataforma para divulgar e vender ingressos para seus eventos.
          </p>
          <Link href="/register">
            <Button className="bg-purple-100 text-purple-900 hover:bg-purple-200 h-11 rounded-md px-8">
              Comece Agora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
