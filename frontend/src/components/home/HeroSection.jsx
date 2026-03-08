import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import Button from '../common/Button';

const stats = [
  { value: '2,500+', label: 'Papers Published', color: 'text-google-blue' },
  { value: '10,000+', label: 'Researchers', color: 'text-google-red' },
  { value: '8,000+', label: 'Reviews Completed', color: 'text-google-green' },
  { value: '24', label: 'Active Issues', color: 'text-google-yellow' },
];

const shapes = [
  { size: 'w-72 h-72', position: 'top-20 -left-20', color: 'bg-google-blue/[0.06]', animation: 'animate-float-slow', round: true },
  { size: 'w-48 h-48', position: 'top-40 right-10', color: 'bg-google-red/[0.06]', animation: 'animate-float-medium', round: true },
  { size: 'w-32 h-32', position: 'bottom-40 left-1/4', color: 'bg-google-yellow/[0.06]', animation: 'animate-float-fast', round: false, rotate: 'rotate-45' },
  { size: 'w-20 h-20', position: 'top-1/3 left-1/3', color: 'bg-google-green/[0.08]', animation: 'animate-float-medium', round: true },
  { size: 'w-16 h-16', position: 'bottom-60 right-1/4', color: 'bg-google-blue/[0.05]', animation: 'animate-float-slow', round: false, rotate: 'rotate-12' },
  { size: 'w-40 h-40', position: '-bottom-10 right-20', color: 'bg-google-green/[0.05]', animation: 'animate-float-fast', round: true },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white">
      {/* Floating geometric shapes */}
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`absolute ${shape.position} ${shape.size} ${shape.color} ${shape.animation} ${shape.rotate || ''} ${
            shape.round ? 'rounded-full' : 'rounded-2xl'
          } blur-sm pointer-events-none`}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, #4285F4 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-blue/[0.08] text-google-blue text-sm font-medium mb-8"
          >
            <BookOpen className="w-4 h-4" />
            Open Access Academic Publishing
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-text"
          >
            <span className="text-google-blue">International</span>
            <br />
            <span className="text-text">Research </span>
            <span className="text-google-green">Archive</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A Modern Platform for Academic Publishing & Peer Review
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/submit">
              <Button size="lg" icon={ArrowRight}>
                Submit Your Paper
              </Button>
            </Link>
            <Link to="/archive">
              <Button variant="outline" size="lg" icon={BookOpen}>
                Browse Archive
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats — DevFest-style cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="text-center p-6 rounded-2xl devfest-card"
            >
              <div className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-text-muted font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-light to-transparent pointer-events-none" />
    </section>
  );
}
