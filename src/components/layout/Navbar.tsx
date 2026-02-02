import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Flame,
  Bell,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <Flame className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-primary-foreground">Idea</span>
              <span className="text-accent">Forge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/ideas"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive('/ideas')
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              Browse Ideas
            </Link>
            {user && (
              <>
                <Link
                  to="/ideas/new"
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
                    isActive('/ideas/new')
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  )}
                >
                  <PlusCircle className="w-4 h-4" />
                  Share Idea
                </Link>
                <Link
                  to="/collaborations"
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive('/collaborations')
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  )}
                >
                  Find Collaborators
                </Link>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full ring-2 ring-accent/50 hover:ring-accent"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-accent text-accent-foreground text-sm font-semibold">
                          {profile?.full_name
                            ? getInitials(profile.full_name)
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-semibold text-foreground">{profile?.full_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {profile?.role?.replace('_', ' ') || 'Member'}
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
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign In
                </Button>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md"
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
            className="md:hidden text-primary-foreground"
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
          className="md:hidden bg-primary border-t border-primary-foreground/10"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-4 mb-2 border-b border-primary-foreground/10">
                  <Avatar className="h-10 w-10 ring-2 ring-accent">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                      {profile?.full_name
                        ? getInitials(profile.full_name)
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-primary-foreground">{profile?.full_name}</p>
                    <p className="text-sm text-primary-foreground/60 capitalize">
                      {profile?.role?.replace('_', ' ') || 'Member'}
                    </p>
                  </div>
                </div>
                <Link
                  to="/ideas"
                  className="block py-2.5 px-3 rounded-lg text-primary-foreground font-medium hover:bg-primary-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Ideas
                </Link>
                <Link
                  to="/ideas/new"
                  className="block py-2.5 px-3 rounded-lg text-primary-foreground font-medium hover:bg-primary-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Share Idea
                </Link>
                <Link
                  to="/collaborations"
                  className="block py-2.5 px-3 rounded-lg text-primary-foreground font-medium hover:bg-primary-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Collaborators
                </Link>
                <Link
                  to="/messages"
                  className="block py-2.5 px-3 rounded-lg text-primary-foreground font-medium hover:bg-primary-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="block py-2.5 px-3 rounded-lg text-primary-foreground font-medium hover:bg-primary-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block py-2.5 px-3 rounded-lg text-destructive font-medium w-full text-left hover:bg-primary-foreground/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/ideas"
                  className="block py-2.5 px-3 rounded-lg text-primary-foreground font-medium hover:bg-primary-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Ideas
                </Link>
                <div className="flex gap-3 pt-4 border-t border-primary-foreground/10">
                  <Button
                    variant="outline"
                    className="flex-1 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
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
