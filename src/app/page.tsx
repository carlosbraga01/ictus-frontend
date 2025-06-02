import { MainLayout } from '@/components/layout';
import {
  HeroSection,
  FeaturedEvents,
  CategoriesSection,
  TestimonialsSection,
  CtaSection,
} from '@/components/home';

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedEvents />
      <CategoriesSection />
      <TestimonialsSection />
      <CtaSection />
    </MainLayout>
  );
}
