import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Shield className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/70">Last updated: January 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-8 md:p-12 space-y-8"
            >
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  IdeaForge ("we," "our," or "us") is committed to protecting
                  your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use
                  our platform.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  2. Information We Collect
                </h2>
                
                <h3 className="font-semibold text-foreground mt-4 mb-2">
                  Information You Provide
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Account information (name, email, password)</li>
                  <li>Profile information (bio, skills, portfolio links, avatar)</li>
                  <li>Ideas and content you submit</li>
                  <li>Messages sent through our platform</li>
                  <li>Communications with our support team</li>
                </ul>

                <h3 className="font-semibold text-foreground mt-4 mb-2">
                  Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>IP address and general location</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve the Platform</li>
                  <li>Create and manage your account</li>
                  <li>Facilitate connections between users</li>
                  <li>Send notifications and updates</li>
                  <li>Respond to support requests</li>
                  <li>Detect and prevent fraud and abuse</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  4. Information Sharing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell your personal information. We may share
                  information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>
                    <strong>With other users:</strong> Profile information you
                    choose to make public, ideas based on your visibility
                    settings
                  </li>
                  <li>
                    <strong>Service providers:</strong> Third parties that help
                    us operate the Platform (hosting, analytics)
                  </li>
                  <li>
                    <strong>Legal requirements:</strong> When required by law or
                    to protect our rights
                  </li>
                  <li>
                    <strong>Business transfers:</strong> In connection with a
                    merger, acquisition, or sale of assets
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  5. Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures
                  to protect your information, including encryption, secure
                  servers, and access controls. However, no method of
                  transmission over the Internet is 100% secure, and we cannot
                  guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  6. Your Rights and Choices
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your data in a
                    structured format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing
                    communications
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  7. Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage, and provide personalized content.
                  You can manage cookie preferences through your browser
                  settings.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  8. Data Retention
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your information for as long as your account is
                  active or as needed to provide services. We may retain certain
                  information for legal, security, or business purposes even
                  after account deletion.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  9. Children's Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  IdeaForge is not intended for users under 18 years of age. We
                  do not knowingly collect information from children. If you
                  believe we have collected information from a minor, please
                  contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  10. International Users
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  IdeaForge is a global platform. By using our services, you
                  consent to the transfer and processing of your information in
                  countries where our servers are located, which may have
                  different data protection laws than your country.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  11. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify
                  you of significant changes via email or through the Platform.
                  Your continued use after changes constitutes acceptance of the
                  updated policy.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  12. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy or our data
                  practices, please contact us at{' '}
                  <a
                    href="mailto:privacy@ideaforge.com"
                    className="text-primary hover:underline"
                  >
                    privacy@ideaforge.com
                  </a>
                  .
                </p>
              </section>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
