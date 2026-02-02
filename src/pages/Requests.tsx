import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { CollaborationRequest, Profile, Idea } from '@/lib/types';
import { useNotifications } from '@/hooks/useNotifications';
import { Inbox, Send, Check, X, Loader2, MessageSquare, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface RequestWithDetails extends CollaborationRequest {
  requester: Profile;
  idea: Idea;
}

export default function Requests() {
  const { profile } = useAuth();
  const { notifyCollaborationAccepted, notifyCollaborationRejected } = useNotifications();
  const [incomingRequests, setIncomingRequests] = useState<RequestWithDetails[]>([]);
  const [sentRequests, setSentRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      fetchRequests();
    }
  }, [profile]);

  const fetchRequests = async () => {
    if (!profile) return;
    setLoading(true);

    // Fetch incoming requests (where current user is the owner)
    const { data: incoming, error: incomingError } = await supabase
      .from('collaboration_requests')
      .select(`
        *,
        requester:profiles!collaboration_requests_requester_id_fkey(*),
        idea:ideas(*)
      `)
      .eq('owner_id', profile.id)
      .order('created_at', { ascending: false });

    if (incomingError) {
      console.error('Error fetching incoming requests:', incomingError);
    } else {
      setIncomingRequests(incoming as RequestWithDetails[]);
    }

    // Fetch sent requests (where current user is the requester)
    const { data: sent, error: sentError } = await supabase
      .from('collaboration_requests')
      .select(`
        *,
        requester:profiles!collaboration_requests_requester_id_fkey(*),
        idea:ideas(*)
      `)
      .eq('requester_id', profile.id)
      .order('created_at', { ascending: false });

    if (sentError) {
      console.error('Error fetching sent requests:', sentError);
    } else {
      setSentRequests(sent as RequestWithDetails[]);
    }

    setLoading(false);
  };

  const handleUpdateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    setProcessingId(requestId);

    // Find the request to get details for notification
    const request = incomingRequests.find(r => r.id === requestId);

    const { error } = await supabase
      .from('collaboration_requests')
      .update({ status })
      .eq('id', requestId);

    if (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request. Please try again.');
    } else {
      toast.success(status === 'approved' ? 'Request approved!' : 'Request rejected');
      fetchRequests();
      
      // Send notification to requester
      if (request && profile) {
        if (status === 'approved') {
          notifyCollaborationAccepted(
            request.requester_id,
            profile.full_name,
            request.idea_id,
            request.idea?.title || 'Unknown Idea',
            profile.id
          );
        } else {
          notifyCollaborationRejected(
            request.requester_id,
            request.idea?.title || 'Unknown Idea',
            profile.id,
            request.idea_id
          );
        }
      }
    }

    setProcessingId(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const pendingIncoming = incomingRequests.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Collaboration Requests
            </h1>
            <p className="text-muted-foreground">
              Manage incoming and outgoing collaboration requests
            </p>
          </div>

          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="incoming" className="flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                Incoming
                {pendingIncoming.length > 0 && (
                  <Badge className="ml-1 h-5 px-1.5 text-xs bg-primary text-primary-foreground">
                    {pendingIncoming.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Sent
              </TabsTrigger>
            </TabsList>

            {/* Incoming Requests */}
            <TabsContent value="incoming">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : incomingRequests.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No incoming requests
                  </h3>
                  <p className="text-muted-foreground">
                    When someone requests to collaborate on your ideas, they'll appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card className="shadow-card">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {/* Requester Info */}
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={request.requester?.avatar_url} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {request.requester?.full_name ? getInitials(request.requester.full_name) : '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-foreground">
                                    {request.requester?.full_name || 'Unknown User'}
                                  </p>
                                  {request.requester?.role && (
                                    <RoleBadge role={request.requester.role} size="sm" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  For: {request.idea?.title || 'Unknown Idea'}
                                </p>
                              </div>
                            </div>

                            {/* Status or Actions */}
                            <div className="flex items-center gap-2">
                              {request.status === 'pending' ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                    disabled={processingId === request.id}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateStatus(request.id, 'approved')}
                                    disabled={processingId === request.id}
                                    className="gradient-primary"
                                  >
                                    {processingId === request.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <>
                                        <Check className="w-4 h-4 mr-1" />
                                        Accept
                                      </>
                                    )}
                                  </Button>
                                </>
                              ) : (
                                getStatusBadge(request.status)
                              )}
                            </div>
                          </div>

                          {/* Message */}
                          {request.message && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                                {request.message}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Sent Requests */}
            <TabsContent value="sent">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : sentRequests.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No sent requests
                  </h3>
                  <p className="text-muted-foreground">
                    Requests you send to collaborate on ideas will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card className="shadow-card">
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground mb-1">
                                {request.idea?.title || 'Unknown Idea'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Requested on {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>

                          {request.message && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                                {request.message}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
