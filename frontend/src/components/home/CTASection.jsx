import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-surface">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231867C0' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="bg-surface rounded-2xl p-12 sm:p-16 elevation-4"
        >
          {/* Google 4-color top bar */}
          <div className="flex justify-center gap-0 mb-8">
            <div className="w-6 h-1 bg-google-blue rounded-l-full" />
            <div className="w-6 h-1 bg-google-red" />
            <div className="w-6 h-1 bg-google-yellow" />
            <div className="w-6 h-1 bg-google-green rounded-r-full" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-6">
            Ready to Publish{' '}
            <span className="gradient-text">Your Research?</span>
          </h2>
          <p className="text-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of researchers who trust IRA for fast, fair, and transparent
            academic publishing. Start your submission today.
          </p>
          <Link to="/register">
            <Button size="lg" icon={ArrowRight}>
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
