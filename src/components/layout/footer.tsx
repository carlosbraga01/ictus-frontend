import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/logo.png" 
                alt="Ictus" 
                width={120} 
                height={40} 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-purple-200 mb-4">
              Ictus é uma plataforma dedicada a conectar cristãos a eventos que fortalecem a fé e promovem a comunhão.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-purple-200 hover:text-white transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-purple-200 hover:text-white transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-purple-200 hover:text-white transition-colors" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-purple-200 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-purple-200 hover:text-white transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-purple-200 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-purple-200 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-purple-200 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-purple-200 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-purple-200 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-purple-200 hover:text-white transition-colors">
                  Política de Reembolso
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-purple-200 hover:text-white transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Fique Conectado</h3>
            <p className="text-sm text-purple-200 mb-4">
              Inscreva-se para receber atualizações sobre novos eventos e promoções.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full p-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Inscrever-se
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-purple-800 mt-8 pt-8 text-center text-sm text-purple-300">
          <p>© {currentYear} Ictus. Todos os direitos reservados.</p>
          <p className="mt-2">
            "Porque nele vivemos, e nos movemos, e existimos." - Atos 17:28
          </p>
        </div>
      </div>
    </footer>
  );
}
