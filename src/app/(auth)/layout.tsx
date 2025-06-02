import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Ictus"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          {children}
        </div>
      </div>
      
      {/* Right side - Image and info */}
      <div className="hidden md:block w-1/2 bg-purple-700 text-white p-12 relative">
        <div className="absolute inset-0 bg-[url('/images/auth-pattern.svg')] opacity-10"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-6">Bem-vindo à Plataforma Ictus</h1>
            <p className="text-lg text-purple-100 mb-8">
              Conecte-se com eventos cristãos que fortalecem sua fé e promovem a comunhão.
            </p>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Por que se juntar a nós?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-purple-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span>Acesso a eventos cristãos exclusivos</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span>Compra de ingressos simplificada e segura</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <span>Comunidade de fé conectada e engajada</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-sm text-purple-200">
            <p>&quot;Porque onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles.&quot; - Mateus 18:20</p>
          </div>
        </div>
      </div>
    </div>
  );
}
