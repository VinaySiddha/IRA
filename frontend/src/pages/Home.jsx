import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsSection from '../components/home/StatsSection';
import LatestPapersSection from '../components/home/LatestPapersSection';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <LatestPapersSection />
      <CTASection />
    </motion.div>
  );
}
