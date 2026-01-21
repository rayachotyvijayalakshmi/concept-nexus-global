import { Link } from 'react-router-dom';
import { Lightbulb, Linkedin, Twitter, Github } from 'lucide-react';

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
                <Link to="/collaborators" className="hover:text-background transition-colors">
                  Find Collaborators
                </Link>
              </li>
              <li>
                <Link to="/ideas/new" className="hover:text-background transition-colors">
                  Share Your Idea
                </Link>
              </li>
            </ul>
          </div>

          {/* For */}
          <div>
            <h4 className="font-display font-semibold mb-4">For</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Idea Owners
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Developers
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Designers
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Mentors
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Investors
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-background transition-colors cursor-pointer">
                  Cookie Policy
                </span>
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
