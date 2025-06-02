import Link from 'next/link';
import { Music, Users, BookOpen, Mic, Heart, Calendar } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function CategoryCard({ title, description, icon, href }: CategoryCardProps) {
  return (
    <Link 
      href={href}
      className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md hover:translate-y-[-2px]"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

export function CategoriesSection() {
  const categories = [
    {
      title: 'Conferências',
      description: 'Eventos de ensino e capacitação com palestrantes renomados.',
      icon: <Mic className="h-8 w-8" />,
      href: '/events?category=conferencias',
    },
    {
      title: 'Louvor e Adoração',
      description: 'Shows e eventos musicais para adorar ao Senhor.',
      icon: <Music className="h-8 w-8" />,
      href: '/events?category=louvor',
    },
    {
      title: 'Estudos Bíblicos',
      description: 'Aprofunde seu conhecimento na Palavra de Deus.',
      icon: <BookOpen className="h-8 w-8" />,
      href: '/events?category=estudos',
    },
    {
      title: 'Retiros',
      description: 'Momentos de renovação espiritual e comunhão.',
      icon: <Heart className="h-8 w-8" />,
      href: '/events?category=retiros',
    },
    {
      title: 'Encontros de Jovens',
      description: 'Eventos voltados para a juventude cristã.',
      icon: <Users className="h-8 w-8" />,
      href: '/events?category=jovens',
    },
    {
      title: 'Eventos Especiais',
      description: 'Celebrações, festas e datas comemorativas.',
      icon: <Calendar className="h-8 w-8" />,
      href: '/events?category=especiais',
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore por Categorias</h2>
          <p className="text-gray-600 text-lg">
            Encontre eventos que atendam aos seus interesses espirituais e fortaleçam sua caminhada com Cristo.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              icon={category.icon}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
