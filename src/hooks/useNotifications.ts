import { supabase } from '@/integrations/supabase/client';

// Secure notification creation using RPC function
// This ensures only authenticated users can create notifications
async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string,
  actorId?: string,
  ideaId?: string
) {
  // Don't notify yourself
  if (actorId && actorId === userId) {
    return { data: null, error: null };
  }

  // Use the secure RPC function instead of direct insert
  const { data, error } = await supabase.rpc('create_notification', {
    p_user_id: userId,
    p_type: type,
    p_title: title,
    p_message: message,
    p_link: link || null,
    p_idea_id: ideaId || null,
    p_actor_id: actorId || null,
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
    return createNotification(
      ideaOwnerId,
      'idea_view',
      'Someone viewed your idea',
      `Your idea "${ideaTitle}" was viewed`,
      `/ideas/${ideaId}`,
      viewerId,
      ideaId
    );
  };

  const notifyProfileView = async (
    profileOwnerId: string,
    viewerId?: string
  ) => {
    return createNotification(
      profileOwnerId,
      'profile_view',
      'Someone viewed your profile',
      'A user viewed your profile',
      '/profile',
      viewerId
    );
  };

  const notifyCollaborationRequest = async (
    ideaOwnerId: string,
    requesterName: string,
    ideaId: string,
    ideaTitle: string,
    requesterId: string
  ) => {
    return createNotification(
      ideaOwnerId,
      'collaboration_request',
      'New collaboration request',
      `${requesterName} wants to collaborate on "${ideaTitle}"`,
      '/requests',
      requesterId,
      ideaId
    );
  };

  const notifyCollaborationAccepted = async (
    requesterId: string,
    ownerName: string,
    ideaId: string,
    ideaTitle: string,
    ownerId: string
  ) => {
    return createNotification(
      requesterId,
      'collaboration_accepted',
      'Collaboration request accepted!',
      `${ownerName} accepted your request to collaborate on "${ideaTitle}"`,
      `/ideas/${ideaId}`,
      ownerId,
      ideaId
    );
  };

  const notifyCollaborationRejected = async (
    requesterId: string,
    ideaTitle: string,
    ownerId: string,
    ideaId: string
  ) => {
    return createNotification(
      requesterId,
      'collaboration_rejected',
      'Collaboration request declined',
      `Your request to collaborate on "${ideaTitle}" was declined`,
      `/ideas/${ideaId}`,
      ownerId,
      ideaId
    );
  };

  const notifyNewMessage = async (
    recipientId: string,
    senderName: string,
    conversationId: string,
    senderId: string
  ) => {
    return createNotification(
      recipientId,
      'new_message',
      'New message',
      `${senderName} sent you a message`,
      '/messages',
      senderId
    );
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
