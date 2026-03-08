import { motion } from 'framer-motion';

const stats = [
  { value: '2,500+', label: 'Papers Published' },
  { value: '150+', label: 'Partner Institutions' },
  { value: '98%', label: 'Review Completion Rate' },
  { value: '14', label: 'Avg. Days to Decision' },
];

export default function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-primary">
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Researchers Worldwide
          </h2>
          <p className="text-lg text-white/[0.7] max-w-xl mx-auto">
            Join a growing community of scholars and institutions advancing human knowledge.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="text-center p-6 rounded-xl bg-white/[0.08] backdrop-blur-sm"
            >
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-white/[0.6] font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
