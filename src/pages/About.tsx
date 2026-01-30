import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Lightbulb,
  Users,
  Shield,
  Globe,
  Target,
  Rocket,
} from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description:
      'We believe every great venture starts with an idea. Our platform nurtures innovation by providing a safe space to share and develop concepts.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'Built by entrepreneurs, for entrepreneurs. We foster meaningful connections between idea owners, developers, designers, mentors, and investors.',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description:
      'Your ideas are valuable. Our permission-based system ensures you control who sees your concepts and when.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description:
      'Connect with talent and opportunities worldwide. Great ideas know no borders, and neither do we.',
  },
];

const team = [
  {
    role: 'For Idea Owners',
    description:
      'Share your vision with the world. Find the perfect team to bring your ideas to life while maintaining control over your intellectual property.',
  },
  {
    role: 'For Developers',
    description:
      'Discover exciting projects that match your skills. Build innovative products and grow your portfolio with meaningful work.',
  },
  {
    role: 'For Designers',
    description:
      'Shape the future of products with your creative expertise. Find projects that value design thinking and user experience.',
  },
  {
    role: 'For Mentors',
    description:
      'Guide the next generation of entrepreneurs. Share your experience and help promising ideas reach their potential.',
  },
  {
    role: 'For Investors',
    description:
      'Discover promising ventures at their earliest stages. Connect directly with passionate founders building the future.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              About IdeaForge
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              We're building the world's most trusted platform for idea
              collaboration. Where visionaries meet the talent they need to turn
              concepts into reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                Our Mission
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Democratizing Innovation
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Too many great ideas never see the light of day because their
                creators lack the resources, connections, or know-how to bring
                them to life. IdeaForge changes that.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We've built a platform where anyone with a vision can find the
                perfect collaborators—whether that's a developer to build an
                MVP, a designer to craft the user experience, a mentor to
                provide guidance, or an investor to provide funding.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our permission-based messaging system ensures that idea owners
                maintain control over their intellectual property while still
                being able to connect with potential collaborators.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={heroIllustration}
                alt="IdeaForge collaboration"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at IdeaForge.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <value.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Everyone in the Startup Ecosystem
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're starting your entrepreneurial journey or looking
              to contribute your expertise, IdeaForge has a place for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                  {item.role}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl gradient-hero p-12 md:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <Rocket className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Be part of a global community of innovators, builders, and
              investors shaping the future.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 h-12 bg-white text-foreground hover:bg-white/90 font-semibold rounded-lg shadow-xl transition-colors"
            >
              Get Started Free
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
