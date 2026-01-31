import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUp, Eye, EyeOff, Clock, User } from 'lucide-react';
import { Idea } from '@/lib/types';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface IdeaCardProps {
  idea: Idea;
  index?: number;
}

export function IdeaCard({ idea, index = 0 }: IdeaCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/ideas/${idea.id}`}>
        <div className="group relative bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-lg transition-all duration-300 hover:border-accent/30 hover:-translate-y-1">
          {/* Visibility indicator - non-clickable */}
          <div className="absolute top-4 right-4 pointer-events-none">
            {idea.visibility === 'public' ? (
              <div className="flex items-center gap-1 text-success text-xs font-medium bg-success/10 px-2 py-1 rounded-full">
                <Eye className="w-3.5 h-3.5" />
                Public
              </div>
            ) : (
              <div className="flex items-center gap-1 text-muted-foreground text-xs font-medium bg-muted px-2 py-1 rounded-full">
                <EyeOff className="w-3.5 h-3.5" />
                Preview
              </div>
            )}
          </div>

          {/* Category */}
          <CategoryBadge category={idea.category} size="sm" className="mb-3" />

          {/* Title */}
          <h3 className="font-display font-semibold text-lg text-foreground mb-2 pr-20 group-hover:text-accent transition-colors line-clamp-2">
            {idea.title}
          </h3>

          {/* Problem Statement */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {idea.problem_statement}
          </p>

          {/* Looking for */}
          {idea.looking_for && idea.looking_for.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Looking for:</p>
              <div className="flex flex-wrap gap-1.5">
                {idea.looking_for.slice(0, 3).map((role) => (
                  <RoleBadge key={role} role={role} size="sm" />
                ))}
                {idea.looking_for.length > 3 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                    +{idea.looking_for.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar className="w-7 h-7">
                <AvatarImage src={idea.owner?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {idea.owner?.full_name
                    ? getInitials(idea.owner.full_name)
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {idea.owner?.full_name || 'Anonymous'}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(idea.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {/* Upvotes */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-medium">{idea.upvotes}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
