import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Idea, Profile } from '@/lib/types';
import { useNotifications } from '@/hooks/useNotifications';
import {
  ArrowLeft,
  ArrowUp,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Users,
  MessageCircle,
  Loader2,
  Lightbulb,
  Target,
  Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile: currentUser } = useAuth();
  const { notifyIdeaView, notifyCollaborationRequest } = useNotifications();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState<string | null>(null);
  const viewNotified = useRef(false);

  useEffect(() => {
    if (id) {
      fetchIdea();
      if (currentUser) {
        checkUpvoteStatus();
        checkExistingRequest();
      }
    }
  }, [id, currentUser]);

  const fetchIdea = async () => {
    setLoading(true);
    const { data: ideaData, error: ideaError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single();

    if (ideaError) {
      console.error('Error fetching idea:', ideaError);
      setLoading(false);
      return;
    }

    setIdea(ideaData as Idea);

    // Fetch owner profile
    const { data: ownerData, error: ownerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', ideaData.owner_id)
      .single();

    if (!ownerError && ownerData) {
      setOwner(ownerData as Profile);
      
      // Notify owner about the view (only once per page load)
      if (currentUser && currentUser.id !== ideaData.owner_id && !viewNotified.current) {
        viewNotified.current = true;
        notifyIdeaView(ideaData.owner_id, ideaData.id, ideaData.title, currentUser.id);
      }
    }

    setLoading(false);
  };

  const checkUpvoteStatus = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('idea_upvotes')
      .select('id')
      .eq('idea_id', id)
      .eq('user_id', currentUser.id)
      .single();

    setHasUpvoted(!!data);
  };

  const checkExistingRequest = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('collaboration_requests')
      .select('status')
      .eq('idea_id', id)
      .eq('requester_id', currentUser.id)
      .single();

    setExistingRequest(data?.status || null);
  };

  const handleUpvote = async () => {
    if (!currentUser) {
      toast.error('Please log in to upvote');
      return;
    }

    setUpvoteLoading(true);

    if (hasUpvoted) {
      const { error } = await supabase
        .from('idea_upvotes')
        .delete()
        .eq('idea_id', id)
        .eq('user_id', currentUser.id);

      if (error) {
        toast.error('Failed to remove upvote');
      } else {
        setHasUpvoted(false);
        if (idea) {
          setIdea({ ...idea, upvotes: (idea.upvotes || 0) - 1 });
        }
      }
    } else {
      const { error } = await supabase.from('idea_upvotes').insert({
        idea_id: id,
        user_id: currentUser.id,
      });

      if (error) {
        toast.error('Failed to upvote');
      } else {
        setHasUpvoted(true);
        if (idea) {
          setIdea({ ...idea, upvotes: (idea.upvotes || 0) + 1 });
        }
      }
    }

    setUpvoteLoading(false);
  };

  const handleRequestCollaboration = async () => {
    if (!currentUser || !idea) return;

    if (currentUser.id === idea.owner_id) {
      toast.error("You can't request collaboration on your own idea");
      return;
    }

    setRequestLoading(true);

    const { error } = await supabase.from('collaboration_requests').insert({
      idea_id: id,
      requester_id: currentUser.id,
      owner_id: idea.owner_id,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('You have already requested collaboration');
      } else {
        toast.error('Failed to send request');
      }
    } else {
      toast.success('Collaboration request sent!');
      setExistingRequest('pending');
      
      // Send notification to idea owner
      if (currentUser && idea) {
        notifyCollaborationRequest(
          idea.owner_id,
          currentUser.full_name,
          idea.id,
          idea.title,
          currentUser.id
        );
      }
    }

    setRequestLoading(false);
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

  if (!idea) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Idea not found</h1>
          <p className="text-muted-foreground mb-8">
            This idea may have been removed or doesn't exist.
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

  const isOwner = currentUser?.id === idea.owner_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/ideas')}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ideas
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-card overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/30 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <CategoryBadge category={idea.category} />
                      {/* Visibility indicator - non-clickable */}
                      <span
                        className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full pointer-events-none select-none"
                        style={{
                          backgroundColor:
                            idea.visibility === 'public'
                              ? 'hsl(var(--success) / 0.1)'
                              : 'hsl(var(--muted))',
                          color:
                            idea.visibility === 'public'
                              ? 'hsl(var(--success))'
                              : 'hsl(var(--muted-foreground))',
                        }}
                      >
                        {idea.visibility === 'public' ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                        {idea.visibility === 'public' ? 'Public' : 'Preview'}
                      </span>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                      {idea.title}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Posted{' '}
                      {formatDistanceToNow(new Date(idea.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  {/* Upvote button */}
                  <Button
                    variant={hasUpvoted ? 'default' : 'outline'}
                    size="lg"
                    onClick={handleUpvote}
                    disabled={upvoteLoading}
                    className="flex flex-col items-center gap-1 h-auto py-3 px-4"
                  >
                    {upvoteLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowUp className="w-5 h-5" />
                    )}
                    <span className="text-sm font-bold">{idea.upvotes || 0}</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-8">
                {/* Problem Statement */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-accent" />
                    <h2 className="font-display font-semibold text-lg">Problem Statement</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {idea.problem_statement}
                  </p>
                </div>

                {/* High Level Concept */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    <h2 className="font-display font-semibold text-lg">High Level Concept</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {idea.high_level_concept}
                  </p>
                </div>

                {/* Detailed Solution - only for public ideas */}
                {idea.visibility === 'public' && idea.detailed_solution && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-accent" />
                      <h2 className="font-display font-semibold text-lg">Detailed Solution</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {idea.detailed_solution}
                    </p>
                  </div>
                )}

                {/* Target Audience */}
                {idea.target_audience && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-accent" />
                      <h2 className="font-display font-semibold text-lg">Target Audience</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {idea.target_audience}
                    </p>
                  </div>
                )}

                {/* Looking for */}
                {idea.looking_for && idea.looking_for.length > 0 && (
                  <div>
                    <h2 className="font-display font-semibold text-lg mb-3">Looking For</h2>
                    <div className="flex flex-wrap gap-2">
                      {idea.looking_for.map((role) => (
                        <RoleBadge key={role} role={role} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Owner section */}
                <div className="border-t border-border pt-6">
                  <h2 className="font-display font-semibold text-lg mb-4">Posted by</h2>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/users/${owner?.id}`}
                      className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={owner?.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {owner?.full_name ? getInitials(owner.full_name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {owner?.full_name || 'Anonymous'}
                        </p>
                        {owner?.headline && (
                          <p className="text-sm text-muted-foreground">{owner.headline}</p>
                        )}
                        {owner?.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {owner.location}
                          </p>
                        )}
                      </div>
                    </Link>

                    {/* Action buttons - only show if not the owner */}
                    {!isOwner && currentUser && (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/messages')}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        {existingRequest ? (
                          <Button disabled variant="secondary">
                            {existingRequest === 'pending' && 'Request Pending'}
                            {existingRequest === 'approved' && 'Approved'}
                            {existingRequest === 'rejected' && 'Rejected'}
                          </Button>
                        ) : (
                          <Button
                            onClick={handleRequestCollaboration}
                            disabled={requestLoading}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground"
                          >
                            {requestLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Users className="w-4 h-4 mr-2" />
                            )}
                            Request Collaboration
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
