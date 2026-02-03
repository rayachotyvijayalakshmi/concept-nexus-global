import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Idea, IdeaCategory, UserRole, categoryLabels, roleLabels } from '@/lib/types';
import { Search, Users, Loader2, Send, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Collaborations() {
  const { profile } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [lookingFor, setLookingFor] = useState<string>('all');
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, [category, lookingFor]);

  const fetchIdeas = async () => {
    setLoading(true);

    let query = supabase
      .from('ideas')
      .select(`
        *,
        owner:profiles!ideas_owner_id_fkey(*)
      `)
      .eq('visibility', 'public');

    if (category !== 'all') {
      query = query.eq('category', category as IdeaCategory);
    }

    if (lookingFor !== 'all') {
      query = query.contains('looking_for', [lookingFor as UserRole]);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ideas:', error);
    } else {
      // Filter out user's own ideas
      const filteredData = profile 
        ? (data as Idea[]).filter(idea => idea.owner_id !== profile.id)
        : (data as Idea[]);
      setIdeas(filteredData);
    }

    setLoading(false);
  };

  const handleRequestAccess = async () => {
    if (!profile || !selectedIdea) return;

    setRequestingId(selectedIdea.id);

    const { error } = await supabase.from('collaboration_requests').insert({
      idea_id: selectedIdea.id,
      requester_id: profile.id,
      owner_id: selectedIdea.owner_id,
      message: requestMessage.trim() || null,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('You have already requested access to this idea');
      } else {
        console.error('Error requesting access:', error);
        toast.error('Failed to send request. Please try again.');
      }
    } else {
      toast.success('Request sent successfully!');
      setDialogOpen(false);
      setRequestMessage('');
      setSelectedIdea(null);
    }

    setRequestingId(null);
  };

  const openRequestDialog = (idea: Idea) => {
    setSelectedIdea(idea);
    setRequestMessage('');
    setDialogOpen(true);
  };

  const filteredIdeas = ideas.filter((idea) =>
    idea.title.toLowerCase().includes(search.toLowerCase()) ||
    idea.problem_statement.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Find Collaborators
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Discover ideas looking for talent like you and request to collaborate
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6 sm:mb-8 shadow-card">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Filters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search ideas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Category */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Looking For */}
              <Select value={lookingFor} onValueChange={setLookingFor}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Looking for" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ideas Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No ideas found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col shadow-card hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <CategoryBadge category={idea.category} />
                      </div>
                      <CardTitle className="text-lg leading-tight line-clamp-2">
                        {idea.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {idea.high_level_concept}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between gap-4">
                      {/* Looking For */}
                      {idea.looking_for && idea.looking_for.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {idea.looking_for.map((role) => (
                            <RoleBadge key={role} role={role} size="sm" />
                          ))}
                        </div>
                      )}

                      {/* Owner & Action */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={idea.owner?.avatar_url} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {idea.owner?.full_name ? getInitials(idea.owner.full_name) : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                            {idea.owner?.full_name || 'Anonymous'}
                          </span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRequestDialog(idea)}
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Request
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Collaboration</DialogTitle>
            <DialogDescription>
              Send a request to collaborate on "{selectedIdea?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and explain why you'd be a great collaborator..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRequestAccess}
                disabled={requestingId === selectedIdea?.id}
                className="gradient-primary"
              >
                {requestingId === selectedIdea?.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
