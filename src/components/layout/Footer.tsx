import { Link } from 'react-router-dom';
import { Flame, Mail } from 'lucide-react';

export function Footer() {
  const contactEmail = 'rayachotyvijayalakshmi@gmail.com';

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Flame className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-primary-foreground">Idea</span>
                <span className="text-accent">Forge</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Where ideas meet the right people. Connect with developers, designers, mentors, and investors to bring your vision to life.
            </p>
            <a 
              href={`mailto:${contactEmail}`}
              className="text-accent hover:text-accent/80 transition-colors text-sm flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {contactEmail}
            </a>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-primary-foreground">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/ideas" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Browse Ideas
                </Link>
              </li>
              <li>
                <Link to="/collaborations" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Find Collaborators
                </Link>
              </li>
              <li>
                <Link to="/ideas/new" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Share Your Idea
                </Link>
              </li>
              <li>
                <Link to="/messages" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-primary-foreground">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-primary-foreground">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} IdeaForge. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50 max-w-md text-center md:text-right">
            Disclaimer: All financial discussions and transactions occur outside the platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
