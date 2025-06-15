import { LandingHeader } from '../components/layout/LandingHeader';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { HowItWorks } from '../components/home/HowItWorks';
import { DoctorShowcase } from '../components/home/DoctorShowcase';
import { Testimonials } from '../components/home/Testimonials';
import { CTA } from '../components/home/CTA';
import { Footer } from '../components/home/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <LandingHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <DoctorShowcase />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};
