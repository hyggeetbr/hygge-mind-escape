import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: 'like' | 'comment';
  post_id: string;
  comment_id?: string;
  is_read: boolean;
  created_at: string;
  actor_profile?: {
    username: string;
    avatar_url?: string;
  };
  post?: {
    title: string;
  };
  comment?: {
    content: string;
  };
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notifications:', error);
        return;
      }

      // Get actor profiles, post titles, and comment content
      const notificationsWithDetails = await Promise.all(
        (notificationsData || []).map(async (notification: any) => {
          const [actorResult, postResult, commentResult] = await Promise.all([
            supabase
              .from('user_profiles')
              .select('username, avatar_url')
              .eq('id', notification.actor_id)
              .single(),
            supabase
              .from('community_posts')
              .select('title')
              .eq('id', notification.post_id)
              .single(),
            notification.comment_id ? supabase
              .from('post_comments')
              .select('content')
              .eq('id', notification.comment_id)
              .single() : Promise.resolve({ data: null })
          ]);

          return {
            ...notification,
            actor_profile: {
              username: actorResult.data?.username || 'User',
              avatar_url: actorResult.data?.avatar_url || null
            },
            post: {
              title: postResult.data?.title || 'Post'
            },
            comment: commentResult.data ? {
              content: commentResult.data.content
            } : undefined
          } as Notification;
        })
      );

      setNotifications(notificationsWithDetails);
      setUnreadCount(notificationsWithDetails.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead
  };
};
