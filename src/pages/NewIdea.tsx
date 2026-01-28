import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IdeaCategory, UserRole, categoryLabels, roleLabels } from '@/lib/types';
import { Lightbulb, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function NewIdea() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [highLevelConcept, setHighLevelConcept] = useState('');
  const [detailedSolution, setDetailedSolution] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('startup');
  const [visibility, setVisibility] = useState<'public' | 'preview'>('preview');
  const [lookingFor, setLookingFor] = useState<UserRole[]>([]);

  const handleRoleToggle = (role: UserRole) => {
    setLookingFor(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast.error('You must be logged in to share an idea');
      return;
    }

    if (!title.trim() || !problemStatement.trim() || !highLevelConcept.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('ideas').insert({
      owner_id: profile.id,
      title: title.trim(),
      problem_statement: problemStatement.trim(),
      high_level_concept: highLevelConcept.trim(),
      detailed_solution: detailedSolution.trim() || null,
      target_audience: targetAudience.trim() || null,
      category,
      visibility,
      looking_for: lookingFor,
    });

    if (error) {
      console.error('Error creating idea:', error);
      toast.error('Failed to create idea. Please try again.');
      setLoading(false);
      return;
    }

    toast.success('Your idea has been shared!');
    navigate('/my-ideas');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/ideas"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ideas
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-card">
              <CardHeader className="text-center pb-2">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Lightbulb className="w-7 h-7 text-primary-foreground" />
                </div>
                <CardTitle className="font-display text-2xl">Share Your Idea</CardTitle>
                <CardDescription>
                  Turn your vision into reality by connecting with the right people
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Idea Title *</Label>
                    <Input
                      id="title"
                      placeholder="Give your idea a catchy name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Problem Statement */}
                  <div className="space-y-2">
                    <Label htmlFor="problem">Problem Statement *</Label>
                    <Textarea
                      id="problem"
                      placeholder="What problem does your idea solve?"
                      value={problemStatement}
                      onChange={(e) => setProblemStatement(e.target.value)}
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* High Level Concept */}
                  <div className="space-y-2">
                    <Label htmlFor="concept">High-Level Concept *</Label>
                    <Textarea
                      id="concept"
                      placeholder="Describe your solution in a few sentences"
                      value={highLevelConcept}
                      onChange={(e) => setHighLevelConcept(e.target.value)}
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Detailed Solution */}
                  <div className="space-y-2">
                    <Label htmlFor="solution">Detailed Solution (Optional)</Label>
                    <Textarea
                      id="solution"
                      placeholder="Go into more detail about how it works..."
                      value={detailedSolution}
                      onChange={(e) => setDetailedSolution(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience (Optional)</Label>
                    <Input
                      id="audience"
                      placeholder="Who is this idea for?"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>

                  {/* Category & Visibility Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={(v) => setCategory(v as IdeaCategory)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Visibility</Label>
                      <Select value={visibility} onValueChange={(v) => setVisibility(v as 'public' | 'preview')}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Show full details</SelectItem>
                          <SelectItem value="preview">Preview - Limited details</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Looking For */}
                  <div className="space-y-3">
                    <Label>Support Needed</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(Object.entries(roleLabels) as [UserRole, string][])
                        .filter(([role]) => role !== 'idea_owner')
                        .map(([role, label]) => (
                          <div
                            key={role}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={role}
                              checked={lookingFor.includes(role)}
                              onCheckedChange={() => handleRoleToggle(role)}
                            />
                            <label
                              htmlFor={role}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 gradient-primary shadow-glow font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Share Idea'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
