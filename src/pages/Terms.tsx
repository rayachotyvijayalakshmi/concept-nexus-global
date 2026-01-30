import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FileText } from 'lucide-react';

export default function Terms() {
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
            <FileText className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-white/70">Last updated: January 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-slate">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-8 md:p-12 space-y-8"
            >
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using IdeaForge ("the Platform"), you accept
                  and agree to be bound by these Terms of Service. If you do not
                  agree to these terms, please do not use the Platform.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  2. Description of Service
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  IdeaForge is a platform that enables users to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Share and discover innovative ideas</li>
                  <li>Connect with potential collaborators, mentors, and investors</li>
                  <li>Communicate through our secure messaging system</li>
                  <li>Build professional profiles and showcase expertise</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  3. User Accounts
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To access certain features, you must create an account. You
                  agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  4. User Content
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You retain ownership of content you submit to IdeaForge. By
                  posting content, you grant us a non-exclusive license to
                  display and distribute your content on the Platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You are solely responsible for the content you post and must
                  ensure it does not violate any third-party rights or
                  applicable laws.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  5. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ideas shared on IdeaForge remain the intellectual property of
                  their creators. The Platform provides tools to control
                  visibility (Public vs Preview mode) but does not guarantee
                  protection of ideas.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Users are encouraged to take appropriate legal measures
                  (patents, trademarks, NDAs) to protect valuable intellectual
                  property before sharing sensitive details.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  6. Prohibited Conduct
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Users may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Use the Platform for illegal purposes</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Post fraudulent, misleading, or deceptive content</li>
                  <li>Attempt to gain unauthorized access to the Platform</li>
                  <li>Scrape, copy, or harvest user data without permission</li>
                  <li>Impersonate others or misrepresent affiliations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  7. Financial Transactions
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  IdeaForge does not facilitate financial transactions between
                  users. Any investments, payments, or financial arrangements
                  occur outside the Platform. Users are responsible for
                  conducting due diligence before entering into any financial
                  agreements.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  8. Disclaimer of Warranties
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Platform is provided "as is" without warranties of any
                  kind. We do not guarantee the accuracy, reliability, or
                  completeness of user-submitted content, nor the success of
                  any collaborations formed through the Platform.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  9. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  IdeaForge shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages arising from your
                  use of the Platform, including loss of profits, data, or
                  business opportunities.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  10. Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate accounts that
                  violate these Terms or for any other reason at our
                  discretion. Users may also delete their accounts at any time.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  11. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms from time to time. Continued use of
                  the Platform after changes constitutes acceptance of the new
                  Terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  12. Contact
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms, please contact us at{' '}
                  <a
                    href="mailto:legal@ideaforge.com"
                    className="text-primary hover:underline"
                  >
                    legal@ideaforge.com
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
