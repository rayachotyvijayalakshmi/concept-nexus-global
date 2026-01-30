import { Link } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">IdeaForge</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where ideas meet the right people. Connect with developers, designers, mentors, and investors to bring your vision to life.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/ideas" className="hover:text-background transition-colors">
                  Browse Ideas
                </Link>
              </li>
              <li>
                <Link to="/collaborations" className="hover:text-background transition-colors">
                  Find Collaborators
                </Link>
              </li>
              <li>
                <Link to="/ideas/new" className="hover:text-background transition-colors">
                  Share Your Idea
                </Link>
              </li>
              <li>
                <Link to="/messages" className="hover:text-background transition-colors">
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-background transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-background transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-background transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-muted-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IdeaForge. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground max-w-md text-center md:text-right">
            Disclaimer: All financial discussions and transactions occur outside the platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
