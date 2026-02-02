import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Eye,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  User,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
  actor_id: string | null;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'idea_view':
      return <Eye className="w-4 h-4 text-accent" />;
    case 'profile_view':
      return <User className="w-4 h-4 text-accent" />;
    case 'collaboration_request':
      return <Users className="w-4 h-4 text-accent" />;
    case 'collaboration_accepted':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'collaboration_rejected':
      return <XCircle className="w-4 h-4 text-destructive" />;
    case 'new_message':
      return <MessageSquare className="w-4 h-4 text-accent" />;
    default:
      return <Bell className="w-4 h-4 text-accent" />;
  }
};

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationListProps) {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={onMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification Items */}
      <ScrollArea className="max-h-[400px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">
              No notifications yet
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              We'll notify you when something happens
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
                  "hover:bg-muted/50",
                  !notification.is_read && "bg-accent/5"
                )}
              >
                <div className="shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm line-clamp-1",
                        notification.is_read
                          ? "text-foreground"
                          : "text-foreground font-medium"
                      )}
                    >
                      {notification.title}
                    </p>
                    {!notification.is_read && (
                      <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-accent" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
