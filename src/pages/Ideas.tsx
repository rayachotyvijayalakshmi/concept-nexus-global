import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { IdeaCard } from '@/components/ideas/IdeaCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Idea, IdeaCategory, UserRole, categoryLabels, roleLabels } from '@/lib/types';
import { Search, Filter, PlusCircle, TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [lookingFor, setLookingFor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'trending'>('recent');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchIdeas();
  }, [category, lookingFor, sortBy]);

  const fetchIdeas = async () => {
    setLoading(true);

    let query = supabase
      .from('ideas')
      .select(`
        *,
        owner:profiles!ideas_owner_id_fkey(*)
      `)
      .eq('visibility', 'public'); // Only fetch public ideas

    if (category !== 'all') {
      query = query.eq('category', category as IdeaCategory);
    }

    if (lookingFor !== 'all') {
      query = query.contains('looking_for', [lookingFor as UserRole]);
    }

    if (sortBy === 'trending') {
      query = query.order('upvotes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ideas:', error);
    } else {
      setIdeas(data as Idea[]);
    }

    setLoading(false);
  };

  const filteredIdeas = ideas.filter((idea) =>
    idea.title.toLowerCase().includes(search.toLowerCase()) ||
    idea.problem_statement.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Explore Ideas
              </h1>
              <p className="text-muted-foreground">
                Discover innovative ideas and find your next collaboration
              </p>
            </div>
            {user && (
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow font-semibold"
                onClick={() => navigate('/ideas/new')}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Share Your Idea
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-8 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
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

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as 'recent' | 'trending')}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="trending">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Trending
                    </span>
                  </SelectItem>
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
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No ideas found
              </h3>
              <p className="text-muted-foreground mb-6">
                {search
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to share an idea!'}
              </p>
              {user && (
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
                  onClick={() => navigate('/ideas/new')}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Share Your Idea
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea, index) => (
                <IdeaCard key={idea.id} idea={idea} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
