import HeroSection from '../components/home/HeroSection';
import CarMakesSection from '../components/home/CarMakesSection';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturesBar from '../components/home/FeaturesBar';
import StatsSection from '../components/home/StatsSection';
import BrandsSection from '../components/home/BrandsSection';
import HowItWorks from '../components/home/HowItWorks';
import PremiumDealers from '../components/home/PremiumDealers';
import FlashSales from '../components/home/FlashSales';
import Testimonials from '../components/home/Testimonials';
import BlogSection from '../components/home/BlogSection';
import Newsletter from '../components/home/Newsletter';
import SEO from '../components/seo/SEO';

const HomePage = () => {
  return (
    <main>
      <SEO />
      <HeroSection />
      <FeaturesBar />
      <BrandsSection />
      <CarMakesSection />
      <CategoriesSection />
      <FlashSales />
      <PremiumDealers />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <BlogSection />
      <Newsletter />
    </main>
  );
};

export default HomePage;
