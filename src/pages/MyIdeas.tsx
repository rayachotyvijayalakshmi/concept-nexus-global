import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Idea } from '@/lib/types';
import {
  Lightbulb,
  PlusCircle,
  Loader2,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Users,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface IdeaWithRequestCount extends Idea {
  request_count?: number;
}

export default function MyIdeas() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<IdeaWithRequestCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchMyIdeas();
    }
  }, [profile]);

  const fetchMyIdeas = async () => {
    if (!profile) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('owner_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
    } else {
      // Fetch request counts for each idea
      const ideasWithCounts = await Promise.all(
        (data as Idea[]).map(async (idea) => {
          const { count } = await supabase
            .from('collaboration_requests')
            .select('*', { count: 'exact', head: true })
            .eq('idea_id', idea.id)
            .eq('status', 'pending');
          
          return { ...idea, request_count: count || 0 };
        })
      );
      
      setIdeas(ideasWithCounts);
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', deleteId);

    if (error) {
      console.error('Error deleting idea:', error);
      toast.error('Failed to delete idea. Please try again.');
    } else {
      toast.success('Idea deleted successfully');
      setIdeas((prev) => prev.filter((idea) => idea.id !== deleteId));
    }

    setDeleteId(null);
    setDeleting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Ideas
              </h1>
              <p className="text-muted-foreground">
                Manage your ideas and collaboration requests
              </p>
            </div>
            <Button
              className="gradient-primary shadow-glow font-semibold"
              onClick={() => navigate('/ideas/new')}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Share New Idea
            </Button>
          </div>

          {/* Ideas List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No ideas yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Share your first idea and start connecting with collaborators
              </p>
              <Button
                className="gradient-primary shadow-glow"
                onClick={() => navigate('/ideas/new')}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Share Your First Idea
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="shadow-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <CategoryBadge category={idea.category} />
                            <Badge
                              variant={idea.visibility === 'public' ? 'default' : 'secondary'}
                              className="flex items-center gap-1"
                            >
                              {idea.visibility === 'public' ? (
                                <Eye className="w-3 h-3" />
                              ) : (
                                <EyeOff className="w-3 h-3" />
                              )}
                              {idea.visibility === 'public' ? 'Public' : 'Preview'}
                            </Badge>
                            {idea.request_count && idea.request_count > 0 && (
                              <Badge className="bg-accent text-accent-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {idea.request_count} request{idea.request_count > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                            {idea.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {idea.high_level_concept}
                          </p>

                          {/* Looking For */}
                          {idea.looking_for && idea.looking_for.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {idea.looking_for.map((role) => (
                                <RoleBadge key={role} role={role} size="sm" />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/ideas/${idea.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            View
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/ideas/${idea.id}/edit`)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteId(idea.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Idea</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this idea? This action cannot be undone.
              All collaboration requests will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
