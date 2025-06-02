import Image from 'next/image';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  image: string;
}

function Testimonial({ quote, author, role, image }: TestimonialProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
      <div className="text-purple-600 mb-4">
        <Quote className="h-8 w-8" />
      </div>
      <p className="text-gray-700 mb-6 flex-grow">{quote}</p>
      <div className="flex items-center">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <Image
            src={image}
            alt={author}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Os eventos do Ictus transformaram minha vida espiritual. Conheci pessoas incríveis e cresci muito na fé.",
      author: "Maria Silva",
      role: "Membro da Igreja Batista",
      image: "/images/testimonials/person1.jpg"
    },
    {
      quote: "As conferências são de altíssima qualidade. Os palestrantes são excelentes e os temas sempre relevantes.",
      author: "João Santos",
      role: "Pastor",
      image: "/images/testimonials/person2.jpg"
    },
    {
      quote: "Nunca foi tão fácil encontrar e participar de eventos cristãos. A plataforma é intuitiva e prática.",
      author: "Ana Oliveira",
      role: "Líder de Jovens",
      image: "/images/testimonials/person3.jpg"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">O Que Dizem Sobre Nós</h2>
        <p className="text-gray-600 text-lg">
          Veja como o Ictus tem impactado a vida de cristãos por todo o Brasil.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Testimonial
            key={testimonial.author}
            quote={testimonial.quote}
            author={testimonial.author}
            role={testimonial.role}
            image={testimonial.image}
          />
        ))}
      </div>
    </div>
  );
}
