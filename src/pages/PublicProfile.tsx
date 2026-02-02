import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { Profile, Idea, UserRole } from '@/lib/types';
import { useNotifications } from '@/hooks/useNotifications';
import {
  ArrowLeft,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Users,
  MessageCircle,
  Loader2,
  Briefcase,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile: currentUser } = useAuth();
  const { notifyProfileView } = useNotifications();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const viewNotified = useRef(false);

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchUserIdeas();
    }
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
      return;
    }

    setProfile(data as Profile);
    
    // Notify profile owner about the view (only once per page load)
    if (currentUser && currentUser.id !== id && !viewNotified.current) {
      viewNotified.current = true;
      notifyProfileView(id!, currentUser.id);
    }
    
    setLoading(false);
  };

  const fetchUserIdeas = async () => {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('owner_id', id)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setIdeas(data as Idea[]);
    }
  };

  const handleStartConversation = async () => {
    if (!currentUser || !profile) return;

    if (currentUser.id === profile.id) {
      toast.error("You can't message yourself");
      return;
    }

    setMessageLoading(true);

    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('id')
      .or(
        `and(participant_one.eq.${currentUser.id},participant_two.eq.${profile.id}),and(participant_one.eq.${profile.id},participant_two.eq.${currentUser.id})`
      )
      .single();

    if (existingConv) {
      navigate('/messages');
      return;
    }

    // Create new conversation
    const { error } = await supabase.from('conversations').insert({
      participant_one: currentUser.id,
      participant_two: profile.id,
    });

    if (error) {
      toast.error('Failed to start conversation');
    } else {
      toast.success('Conversation started');
      navigate('/messages');
    }

    setMessageLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Profile not found</h1>
          <p className="text-muted-foreground mb-8">
            This user may have been removed or doesn't exist.
          </p>
          <Button onClick={() => navigate('/ideas')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ideas
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <Card className="shadow-card overflow-hidden">
              <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 pb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {profile.full_name ? getInitials(profile.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                      {profile.full_name}
                    </h1>
                    {profile.headline && (
                      <p className="text-muted-foreground text-lg mb-2">{profile.headline}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      <RoleBadge role={profile.role as UserRole} />
                      {profile.location && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  {!isOwnProfile && currentUser && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleStartConversation}
                        disabled={messageLoading}
                      >
                        {messageLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <MessageCircle className="w-4 h-4 mr-2" />
                        )}
                        Message
                      </Button>
                    </div>
                  )}

                  {isOwnProfile && (
                    <Button onClick={() => navigate('/profile')}>Edit Profile</Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* About */}
                {profile.about && (
                  <div>
                    <h2 className="font-display font-semibold text-lg mb-2 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-accent" />
                      About
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {profile.about}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h2 className="font-display font-semibold text-lg mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(profile.linkedin_url || profile.github_url || profile.portfolio_url) && (
                  <div>
                    <h2 className="font-display font-semibold text-lg mb-3">Links</h2>
                    <div className="flex flex-wrap gap-3">
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-[#0077B5]/10 text-[#0077B5] rounded-lg hover:bg-[#0077B5]/20 transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {profile.github_url && (
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {profile.portfolio_url && (
                        <a
                          href={profile.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          Portfolio
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User's Ideas */}
            {ideas.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="font-display font-semibold text-xl flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    Ideas by {profile.full_name}
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ideas.map((idea) => (
                    <Link
                      key={idea.id}
                      to={`/ideas/${idea.id}`}
                      className="block p-4 rounded-lg border border-border hover:border-accent/30 hover:bg-muted/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CategoryBadge category={idea.category} size="sm" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{idea.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {idea.problem_statement}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 pointer-events-none select-none">
                          <Users className="w-4 h-4" />
                          {idea.upvotes || 0}
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {ideas.length === 0 && (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Lightbulb className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {profile.full_name} hasn't shared any public ideas yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
