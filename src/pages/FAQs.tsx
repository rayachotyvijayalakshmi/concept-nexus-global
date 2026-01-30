import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';

const faqCategories = [
  {
    title: 'Getting Started',
    faqs: [
      {
        question: 'What is IdeaForge?',
        answer:
          'IdeaForge is a global platform that connects idea owners with developers, designers, mentors, and investors. It provides a secure environment to share your ideas, find collaborators, and build meaningful partnerships to bring your vision to life.',
      },
      {
        question: 'Is IdeaForge free to use?',
        answer:
          'Yes, IdeaForge is free to join and use. You can create an account, share ideas, browse collaborators, and connect with others without any cost. We may introduce premium features in the future, but the core functionality will always remain free.',
      },
      {
        question: 'Who can use IdeaForge?',
        answer:
          'IdeaForge is designed for anyone in the startup ecosystem—entrepreneurs with ideas, developers looking for interesting projects, designers wanting to shape products, mentors willing to guide others, and investors seeking early-stage opportunities.',
      },
    ],
  },
  {
    title: 'Ideas & Privacy',
    faqs: [
      {
        question: 'How are my ideas protected?',
        answer:
          'IdeaForge takes idea protection seriously. You can choose between "Public" visibility (where everyone can see full details) or "Preview" mode (where only approved collaborators see the complete idea). Our permission-based messaging system ensures you control who can contact you about your ideas.',
      },
      {
        question: 'What\'s the difference between Public and Preview visibility?',
        answer:
          'Public ideas are fully visible to all users, making them great for gathering interest and feedback. Preview mode shows a limited summary to browsers, and full details are only revealed to collaborators you\'ve approved. This protects sensitive concepts while still allowing discovery.',
      },
      {
        question: 'Can I delete or edit my ideas?',
        answer:
          'Yes, you have full control over your ideas. You can edit details, change visibility settings, or delete ideas entirely from your "My Ideas" dashboard at any time.',
      },
    ],
  },
  {
    title: 'Collaboration & Messaging',
    faqs: [
      {
        question: 'How does the collaboration request process work?',
        answer:
          'When you find an idea you\'re interested in, you can send a collaboration request with a message explaining your interest and how you can contribute. The idea owner reviews your request and can accept or reject it. Once accepted, you gain full access to the idea details and can start private messaging.',
      },
      {
        question: 'Who can message whom?',
        answer:
          'Messaging is permission-based. For most roles, you need to send a collaboration request first. Once approved, private messaging is enabled. Investors have special rules—they cannot initiate contact, but idea owners can send them introductory messages (limited to 1-2 messages before formal approval).',
      },
      {
        question: 'Is there a limit to messages I can send?',
        answer:
          'Before a collaboration is approved, there\'s a limit of 2 introductory messages. This prevents spam and ensures meaningful connections. Once approved, there are no messaging limits for private conversations.',
      },
      {
        question: 'Can I block or report users?',
        answer:
          'Yes, you can block users to prevent them from contacting you or viewing your profile. You can also report inappropriate behavior or content, which our team will review and take action on as needed.',
      },
    ],
  },
  {
    title: 'Account & Profile',
    faqs: [
      {
        question: 'Can I change my role after signing up?',
        answer:
          'Yes, you can update your role from your profile settings at any time. Your role determines how you appear to others and what role-specific fields are available on your profile (e.g., investors have investment stage and ticket size fields).',
      },
      {
        question: 'How do I make my profile stand out?',
        answer:
          'Complete your profile with a professional photo, compelling headline, detailed bio, relevant skills, and portfolio links (LinkedIn, GitHub, Behance, personal website). The more complete your profile, the more trustworthy you appear to potential collaborators.',
      },
      {
        question: 'Is my email address visible to others?',
        answer:
          'No, your email address is kept private. Other users can only see your name, role, headline, and public profile information. All communication happens through our secure messaging system.',
      },
    ],
  },
  {
    title: 'Platform & Security',
    faqs: [
      {
        question: 'How does IdeaForge make money?',
        answer:
          'Currently, IdeaForge is focused on building a strong community and providing value to users. We plan to introduce optional premium features and services in the future while keeping the core platform free.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Yes, we use industry-standard security practices including encrypted connections (HTTPS), secure authentication, and row-level security for database access. Your data is protected and only accessible according to our privacy policy.',
      },
      {
        question: 'Can I export my data?',
        answer:
          'Yes, you can request an export of your data by contacting our support team. We believe in data portability and your right to access your information.',
      },
    ],
  },
];

export default function FAQs() {
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
            <HelpCircle className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Find answers to common questions about IdeaForge, how it works,
              and how to get the most out of the platform.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="bg-card rounded-xl border border-border px-6"
                    >
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mt-16 text-center"
          >
            <div className="bg-muted/50 rounded-2xl p-8">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Still Have Questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is happy to
                help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg transition-colors"
              >
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
