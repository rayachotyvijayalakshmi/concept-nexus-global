import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Lightbulb,
  Menu,
  X,
  User,
  LogOut,
  MessageSquare,
  PlusCircle,
  Search,
  Bell,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
              <Lightbulb className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              IdeaForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/ideas"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Browse Ideas
                </Link>
                <Link
                  to="/ideas/new"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Share Idea
                </Link>
                <Link
                  to="/collaborators"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Find Collaborators
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/ideas"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Browse Ideas
                </Link>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {profile?.full_name
                            ? getInitials(profile.full_name)
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium">{profile?.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-ideas')}>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      My Ideas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/requests')}>
                      <Bell className="w-4 h-4 mr-2" />
                      Requests
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button
                  className="gradient-primary shadow-glow"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="container mx-auto px-4 py-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name
                        ? getInitials(profile.full_name)
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profile?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </div>
                <Link
                  to="/ideas"
                  className="block py-2 text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Ideas
                </Link>
                <Link
                  to="/ideas/new"
                  className="block py-2 text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Share Idea
                </Link>
                <Link
                  to="/collaborators"
                  className="block py-2 text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Collaborators
                </Link>
                <Link
                  to="/messages"
                  className="block py-2 text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block py-2 text-destructive font-medium w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/ideas"
                  className="block py-2 text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Ideas
                </Link>
                <div className="flex gap-3 pt-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="flex-1 gradient-primary"
                    onClick={() => {
                      navigate('/signup');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
