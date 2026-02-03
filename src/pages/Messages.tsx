import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { useNotifications } from '@/hooks/useNotifications';
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  Loader2,
  CheckCheck,
  Paperclip,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, isYesterday } from 'date-fns';
import { Profile, Message, Conversation } from '@/lib/types';
import messagingIllustration from '@/assets/messaging-illustration.png';

interface ConversationWithDetails extends Conversation {
  other_participant?: Profile;
  last_message?: Message;
  unread_count?: number;
}

export default function Messages() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { notifyNewMessage } = useNotifications();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && profile) {
      fetchConversations();
    }
  }, [profile, authLoading]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      
      // Set up realtime subscription for new messages
      const channel = supabase
        .channel(`messages:${selectedConversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation.id}`,
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages((prev) => [...prev, newMsg]);
            scrollToBottom();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_one.eq.${profile.id},participant_two.eq.${profile.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
      return;
    }

    // Fetch other participant details for each conversation
    const conversationsWithDetails = await Promise.all(
      (data || []).map(async (conv) => {
        const otherParticipantId =
          conv.participant_one === profile.id
            ? conv.participant_two
            : conv.participant_one;

        const { data: participantData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherParticipantId)
          .single();

        // Get last message
        const { data: lastMessageData } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', profile.id)
          .eq('is_read', false);

        return {
          ...conv,
          other_participant: participantData || undefined,
          last_message: lastMessageData || undefined,
          unread_count: count || 0,
        };
      })
    );

    setConversations(conversationsWithDetails);
    setLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);

    // Mark messages as read
    if (profile) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', profile.id);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !profile) return;

    // Check message limits for unapproved conversations
    if (!selectedConversation.is_approved && (selectedConversation.intro_messages_count || 0) >= 2) {
      toast.error('Message limit reached. Wait for the idea owner to approve your request.');
      return;
    }

    setSendingMessage(true);

    const { error } = await supabase.from('messages').insert([
      {
        conversation_id: selectedConversation.id,
        sender_id: profile.id,
        content: newMessage.trim(),
      },
    ]);

    if (error) {
      toast.error('Failed to send message');
      setSendingMessage(false);
      return;
    }

    // Update intro messages count if not approved
    if (!selectedConversation.is_approved) {
      await supabase
        .from('conversations')
        .update({
          intro_messages_count: (selectedConversation.intro_messages_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedConversation.id);
    }

    // Send notification to the other participant
    if (selectedConversation.other_participant) {
      notifyNewMessage(
        selectedConversation.other_participant.id,
        profile.full_name,
        selectedConversation.id,
        profile.id
      );
    }

    setNewMessage('');
    setSendingMessage(false);
    fetchConversations();
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'MMM d');
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.other_participant?.full_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16 sm:pt-20">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-card overflow-hidden h-[calc(100vh-120px)] sm:h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] min-h-[400px] sm:min-h-[600px]">
            <div className="flex h-full">
              {/* Conversation List */}
              <div
                className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${
                  selectedConversation ? 'hidden md:flex' : 'flex'
                }`}
              >
                <div className="p-4 border-b border-border">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Messages
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <img
                        src={messagingIllustration}
                        alt="No messages"
                        className="w-32 h-32 mx-auto mb-4 opacity-50"
                      />
                      <p className="text-muted-foreground">
                        No conversations yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Start by sending a collaboration request
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border ${
                          selectedConversation?.id === conv.id
                            ? 'bg-muted/50'
                            : ''
                        }`}
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={conv.other_participant?.avatar_url || ''}
                          />
                          <AvatarFallback>
                            {conv.other_participant?.full_name?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground truncate">
                              {conv.other_participant?.full_name || 'Unknown'}
                            </span>
                            {conv.last_message && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatMessageDate(conv.last_message.created_at)}
                              </span>
                            )}
                          </div>
                          {conv.other_participant?.role && (
                            <RoleBadge
                              role={conv.other_participant.role}
                              size="sm"
                              className="mt-1"
                            />
                          )}
                          {conv.last_message && (
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {conv.last_message.content}
                            </p>
                          )}
                          {(conv.unread_count || 0) > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-primary-foreground bg-primary rounded-full mt-1">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </ScrollArea>
              </div>

              {/* Message Area */}
              <div
                className={`flex-1 flex flex-col ${
                  selectedConversation ? 'flex' : 'hidden md:flex'
                }`}
              >
                {selectedConversation ? (
                  <>
                    {/* Conversation Header */}
                    <div className="p-4 border-b border-border flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            selectedConversation.other_participant
                              ?.avatar_url || ''
                          }
                        />
                        <AvatarFallback>
                          {selectedConversation.other_participant
                            ?.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {selectedConversation.other_participant?.full_name ||
                            'Unknown'}
                        </h3>
                        {selectedConversation.other_participant?.role && (
                          <RoleBadge
                            role={selectedConversation.other_participant.role}
                            size="sm"
                          />
                        )}
                      </div>
                      {!selectedConversation.is_approved && (
                        <span className="ml-auto text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-medium whitespace-nowrap">
                          Limited ({2 - (selectedConversation.intro_messages_count || 0)} left)
                        </span>
                      )}
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => {
                          const isOwn = msg.sender_id === profile?.id;
                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${
                                isOwn ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground rounded-br-md'
                                    : 'bg-muted text-foreground rounded-bl-md'
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <div
                                  className={`flex items-center gap-1 mt-1 text-xs ${
                                    isOwn
                                      ? 'text-primary-foreground/70'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  <span>{format(new Date(msg.created_at), 'h:mm a')}</span>
                                  {isOwn && msg.is_read && (
                                    <CheckCheck className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage();
                        }}
                        className="flex items-center gap-2"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                        >
                          <Paperclip className="w-5 h-5" />
                        </Button>
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                          disabled={
                            !selectedConversation.is_approved &&
                            (selectedConversation.intro_messages_count || 0) >= 2
                          }
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={!newMessage.trim() || sendingMessage}
                          className="gradient-primary shadow-glow"
                        >
                          {sendingMessage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-display text-lg font-medium text-foreground mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
