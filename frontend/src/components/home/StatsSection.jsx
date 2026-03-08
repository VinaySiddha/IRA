import { motion } from 'framer-motion';

const stats = [
  { value: '2,500+', label: 'Papers Published', color: 'text-google-blue' },
  { value: '150+', label: 'Partner Institutions', color: 'text-google-red' },
  { value: '98%', label: 'Review Completion Rate', color: 'text-google-green' },
  { value: '14', label: 'Avg. Days to Decision', color: 'text-google-yellow' },
];

export default function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-surface-dark">
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
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
          <div className="flex justify-center gap-1 mb-6">
            <div className="w-8 h-1 bg-google-blue rounded-full" />
            <div className="w-8 h-1 bg-google-red rounded-full" />
            <div className="w-8 h-1 bg-google-yellow rounded-full" />
            <div className="w-8 h-1 bg-google-green rounded-full" />
          </div>
          <p className="text-lg text-white/[0.6] max-w-xl mx-auto">
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
              className="text-center p-6 rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08]"
            >
              <div className={`text-4xl sm:text-5xl font-bold ${stat.color} mb-2`}>
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
