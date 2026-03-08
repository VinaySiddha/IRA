import { motion } from 'framer-motion';
import {
  Upload,
  Users,
  BookOpen,
  Sparkles,
  Search,
  Settings,
} from 'lucide-react';
import Card from '../common/Card';

const features = [
  {
    icon: Upload,
    title: 'Submit & Track',
    description:
      'Seamlessly upload your manuscripts and track their progress through every stage of the review process.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Users,
    title: 'Peer Review',
    description:
      'Structured double-blind peer review process with detailed feedback forms and reviewer matching.',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: BookOpen,
    title: 'Publish & Index',
    description:
      'Get your accepted papers published with DOI assignment, citation generation, and indexing.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description:
      'AI-powered reviewer matching ensures your paper is reviewed by the most qualified experts in the field.',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: Search,
    title: 'Archive Access',
    description:
      'Full-text searchable archive with advanced filters for category, author, date, and keyword search.',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Settings,
    title: 'Editorial Tools',
    description:
      'Comprehensive dashboard for editors to manage submissions, assign reviewers, and make decisions.',
    color: 'bg-error/10 text-error',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
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
            <span className="gradient-text">Academic Publishing</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6" />
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            From submission to publication, IRA provides a complete suite of tools
            designed for modern research workflows.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="p-8 h-full" gradient>
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
