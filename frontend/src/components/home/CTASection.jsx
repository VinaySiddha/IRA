import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="devfest-card p-12 sm:p-16 relative overflow-hidden"
        >
          {/* Decorative Google-colored shapes */}
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-google-blue rounded-full opacity-15" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-google-green rounded-full opacity-10" />
          <div className="absolute top-8 -left-4 w-16 h-16 bg-google-red rounded-full opacity-12" />
          <div className="absolute -bottom-4 right-16 w-20 h-20 bg-google-yellow rounded-full opacity-10" />

          <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-6">
            Ready to Publish{' '}
            <span className="text-google-blue">Your Research?</span>
          </h2>
          <p className="relative text-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of researchers who trust IRA for fast, fair, and transparent
            academic publishing. Start your submission today.
          </p>
          <Link to="/register" className="relative inline-block">
            <Button size="lg" icon={ArrowRight}>
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
