import { cn } from '@/lib/utils';
import { IdeaCategory, categoryLabels } from '@/lib/types';

interface CategoryBadgeProps {
  category: IdeaCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium bg-secondary text-secondary-foreground',
        sizeClasses[size],
        className
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}
