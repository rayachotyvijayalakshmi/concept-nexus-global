import { supabase } from '@/integrations/supabase/client';

interface CreateNotificationParams {
  userId: string;
  type: 'idea_view' | 'profile_view' | 'collaboration_request' | 'collaboration_accepted' | 'collaboration_rejected' | 'new_message';
  title: string;
  message: string;
  link?: string;
  actorId?: string;
  ideaId?: string;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  actorId,
  ideaId,
}: CreateNotificationParams) {
  // Don't notify yourself
  if (actorId && actorId === userId) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      link: link || null,
      actor_id: actorId || null,
      idea_id: ideaId || null,
    });

  if (error) {
    console.error('Error creating notification:', error);
  }

  return { data, error };
}

export function useNotifications() {
  const notifyIdeaView = async (
    ideaOwnerId: string,
    ideaId: string,
    ideaTitle: string,
    viewerId?: string
  ) => {
    return createNotification({
      userId: ideaOwnerId,
      type: 'idea_view',
      title: 'Someone viewed your idea',
      message: `Your idea "${ideaTitle}" was viewed`,
      link: `/ideas/${ideaId}`,
      actorId: viewerId,
      ideaId,
    });
  };

  const notifyProfileView = async (
    profileOwnerId: string,
    viewerId?: string
  ) => {
    return createNotification({
      userId: profileOwnerId,
      type: 'profile_view',
      title: 'Someone viewed your profile',
      message: 'A user viewed your profile',
      link: '/profile',
      actorId: viewerId,
    });
  };

  const notifyCollaborationRequest = async (
    ideaOwnerId: string,
    requesterName: string,
    ideaId: string,
    ideaTitle: string,
    requesterId: string
  ) => {
    return createNotification({
      userId: ideaOwnerId,
      type: 'collaboration_request',
      title: 'New collaboration request',
      message: `${requesterName} wants to collaborate on "${ideaTitle}"`,
      link: '/requests',
      actorId: requesterId,
      ideaId,
    });
  };

  const notifyCollaborationAccepted = async (
    requesterId: string,
    ownerName: string,
    ideaId: string,
    ideaTitle: string,
    ownerId: string
  ) => {
    return createNotification({
      userId: requesterId,
      type: 'collaboration_accepted',
      title: 'Collaboration request accepted!',
      message: `${ownerName} accepted your request to collaborate on "${ideaTitle}"`,
      link: `/ideas/${ideaId}`,
      actorId: ownerId,
      ideaId,
    });
  };

  const notifyCollaborationRejected = async (
    requesterId: string,
    ideaTitle: string,
    ownerId: string,
    ideaId: string
  ) => {
    return createNotification({
      userId: requesterId,
      type: 'collaboration_rejected',
      title: 'Collaboration request declined',
      message: `Your request to collaborate on "${ideaTitle}" was declined`,
      link: `/ideas/${ideaId}`,
      actorId: ownerId,
      ideaId,
    });
  };

  const notifyNewMessage = async (
    recipientId: string,
    senderName: string,
    conversationId: string,
    senderId: string
  ) => {
    return createNotification({
      userId: recipientId,
      type: 'new_message',
      title: 'New message',
      message: `${senderName} sent you a message`,
      link: '/messages',
      actorId: senderId,
    });
  };

  return {
    notifyIdeaView,
    notifyProfileView,
    notifyCollaborationRequest,
    notifyCollaborationAccepted,
    notifyCollaborationRejected,
    notifyNewMessage,
  };
}
