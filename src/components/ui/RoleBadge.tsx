import { cn } from '@/lib/utils';
import { UserRole, roleLabels, roleColors } from '@/lib/types';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RoleBadge({ role, size = 'md', className }: RoleBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        roleColors[role],
        sizeClasses[size],
        className
      )}
    >
      {roleLabels[role]}
    </span>
  );
}
