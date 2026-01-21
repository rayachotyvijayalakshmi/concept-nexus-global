import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, ExternalLink, DollarSign } from 'lucide-react';
import { Profile } from '@/lib/types';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: Profile;
  index?: number;
}

export function ProfileCard({ profile, index = 0 }: ProfileCardProps) {
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
      <Link to={`/profile/${profile.id}`}>
        <div className="group relative bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-lg transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-14 h-14 ring-2 ring-border">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                {profile.full_name}
              </h3>
              {profile.headline && (
                <p className="text-sm text-muted-foreground truncate">
                  {profile.headline}
                </p>
              )}
              <RoleBadge role={profile.role} size="sm" className="mt-2" />
            </div>
          </div>

          {/* Location & Experience */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {profile.location}
              </div>
            )}
            {profile.experience_years && (
              <div className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {profile.experience_years} years exp.
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{profile.skills.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Investor specific */}
          {profile.role === 'investor' && profile.open_to_pitches && (
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg text-accent text-sm font-medium">
              <DollarSign className="w-4 h-4" />
              Open to Pitches
            </div>
          )}

          {/* External Links */}
          {(profile.linkedin_url ||
            profile.github_url ||
            profile.portfolio_url) && (
            <div className="flex items-center gap-2 pt-4 border-t border-border mt-4">
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
