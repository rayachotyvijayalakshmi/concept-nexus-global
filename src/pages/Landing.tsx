import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Lightbulb,
  Code2,
  Palette,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Sparkles,
  Target,
  Handshake,
  Rocket,
  Flame,
} from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';

const features = [
  {
    icon: Lightbulb,
    title: 'Share Your Vision',
    description:
      'Present your ideas with customizable privacy controls. Full visibility or protected preview mode.',
  },
  {
    icon: Handshake,
    title: 'Connect with Talent',
    description:
      'Find developers, designers, mentors, and investors who align with your vision.',
  },
  {
    icon: Shield,
    title: 'Protected Communication',
    description:
      'Approval-based messaging ensures meaningful connections and protects your ideas.',
  },
  {
    icon: Rocket,
    title: 'Launch Together',
    description:
      'Build trusted relationships and bring your ideas to life with the right team.',
  },
];

const roles = [
  {
    role: 'Idea Owners',
    description: 'Share your vision and find the perfect team to bring it to life.',
    icon: Target,
    color: 'bg-role-idea-owner',
  },
  {
    role: 'Developers',
    description: 'Discover exciting projects and turn innovative ideas into reality.',
    icon: Code2,
    color: 'bg-role-developer',
  },
  {
    role: 'Designers',
    description: 'Shape the future of products with your creative expertise.',
    icon: Palette,
    color: 'bg-role-designer',
  },
  {
    role: 'Mentors',
    description: 'Guide entrepreneurs and share your valuable experience.',
    icon: Users,
    color: 'bg-role-mentor',
  },
  {
    role: 'Investors',
    description: 'Discover promising ventures at their earliest stages.',
    icon: TrendingUp,
    color: 'bg-role-investor',
  },
];

const stats = [
  { value: 'Global', label: 'Community' },
  { value: '100%', label: 'Secure' },
  { value: 'Free', label: 'To Join' },
  { value: '24/7', label: 'Access' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero opacity-95" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm font-medium mb-8 backdrop-blur-sm border border-primary-foreground/10">
                <Sparkles className="w-4 h-4" />
                The platform for idea collaboration
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Where Ideas Meet{' '}
                <span className="text-accent">
                  The Right People
                </span>
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl leading-relaxed">
                Connect with developers, designers, mentors, and investors. 
                Build trusted relationships and transform your vision into reality.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl px-8 h-14 text-base font-semibold"
                  onClick={() => navigate('/ideas')}
                >
                  Browse Ideas
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm px-8 h-14 text-base font-semibold"
                  onClick={() => navigate('/signup')}
                >
                  Share Your Idea
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-left">
                    <div className="text-2xl md:text-3xl font-display font-bold text-accent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-primary-foreground/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img
                src={heroIllustration}
                alt="IdeaForge - Connect ideas with the right people"
                className="w-full rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A secure platform designed to foster meaningful connections and protect your innovative ideas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 md:py-32 gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Every Role
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're an entrepreneur with a vision or an expert looking to contribute, 
              IdeaForge connects you with the right opportunities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {roles.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
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

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl gradient-hero p-12 md:p-20 text-center"
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Forge Your Next Big Idea?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto">
                Join a global community of innovators, builders, and investors. 
                Your next breakthrough starts here.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl px-8 h-14 text-base font-semibold"
                  onClick={() => navigate('/signup')}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 h-14 text-base font-semibold"
                  onClick={() => navigate('/ideas')}
                >
                  Explore Ideas
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
