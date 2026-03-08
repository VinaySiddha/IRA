import { motion } from 'framer-motion';
import {
  Upload,
  Users,
  BookOpen,
  Sparkles,
  Search,
  Settings,
} from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Submit & Track',
    description:
      'Seamlessly upload your manuscripts and track their progress through every stage of the review process.',
    iconColor: 'text-google-blue',
    bgColor: 'bg-google-blue/[0.08]',
    decoColor: 'bg-google-red',
  },
  {
    icon: Users,
    title: 'Peer Review',
    description:
      'Structured double-blind peer review process with detailed feedback forms and reviewer matching.',
    iconColor: 'text-google-green',
    bgColor: 'bg-google-green/[0.08]',
    decoColor: 'bg-google-blue',
  },
  {
    icon: BookOpen,
    title: 'Publish & Index',
    description:
      'Get your accepted papers published with DOI assignment, citation generation, and indexing.',
    iconColor: 'text-google-red',
    bgColor: 'bg-google-red/[0.08]',
    decoColor: 'bg-google-green',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description:
      'AI-powered reviewer matching ensures your paper is reviewed by the most qualified experts in the field.',
    iconColor: 'text-google-yellow',
    bgColor: 'bg-google-yellow/[0.12]',
    decoColor: 'bg-google-yellow',
  },
  {
    icon: Search,
    title: 'Archive Access',
    description:
      'Full-text searchable archive with advanced filters for category, author, date, and keyword search.',
    iconColor: 'text-google-blue',
    bgColor: 'bg-google-blue/[0.08]',
    decoColor: 'bg-google-red',
  },
  {
    icon: Settings,
    title: 'Editorial Tools',
    description:
      'Comprehensive dashboard for editors to manage submissions, assign reviewers, and make decisions.',
    iconColor: 'text-google-green',
    bgColor: 'bg-google-green/[0.08]',
    decoColor: 'bg-google-blue',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            Everything You Need for{' '}
            <span className="text-google-blue">Academic Publishing</span>
          </h2>
          <div className="flex justify-center gap-1 mb-6">
            <div className="w-8 h-1 bg-google-blue rounded-full" />
            <div className="w-8 h-1 bg-google-red rounded-full" />
            <div className="w-8 h-1 bg-google-yellow rounded-full" />
            <div className="w-8 h-1 bg-google-green rounded-full" />
          </div>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            From submission to publication, IRA provides a complete suite of tools
            designed for modern research workflows.
          </p>
        </motion.div>

        {/* Features Grid — DevFest card style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <div className="devfest-card p-8 h-full relative overflow-hidden">
                {/* Decorative shape — like DevFest cards */}
                <div className={`absolute -top-4 -right-4 w-20 h-20 ${feature.decoColor} rounded-full opacity-20`} />
                <div className={`absolute -top-2 -right-8 w-14 h-14 ${feature.decoColor} rounded-full opacity-15`} />

                <div
                  className={`relative w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
