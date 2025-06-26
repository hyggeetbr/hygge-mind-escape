
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // For nudges, just mark as read since they don't link to posts
    // Only navigate to post if it's not a nudge and post_id exists
    if (notification.type !== 'nudge' && notification.post_id) {
      navigate(`/post/${notification.post_id}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-light mb-4">Please sign in to view notifications</h2>
          <Button onClick={() => navigate("/")} className="bg-white text-black hover:bg-white/90">Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/community")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-white text-xl font-medium">Notifications</h1>
        
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={markAllAsRead}
            className="text-purple-400 hover:bg-purple-500/10 text-sm"
          >
            Mark all read
          </Button>
        )}
        
        {unreadCount === 0 && <div className="w-20"></div>}
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white/60">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No notifications yet</h3>
            <p className="text-white/60">
              You'll see notifications here when people like or comment on your posts, or send you nudges.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  notification.is_read
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${
                    notification.type === 'nudge' 
                      ? 'bg-gradient-to-br from-pink-500 to-red-500' 
                      : 'bg-gradient-to-br from-purple-500 to-blue-500'
                  }`}>
                    {notification.actor_profile?.avatar_url ? (
                      <img 
                        src={notification.actor_profile.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : notification.type === 'nudge' ? (
                      <Heart className="w-5 h-5" />
                    ) : (
                      getInitials(notification.actor_profile?.username || 'User')
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-semibold">{notification.actor_profile?.username}</span>
                      {notification.type === 'like' && ' liked your post'}
                      {notification.type === 'comment' && ' commented on your post'}
                      {notification.type === 'nudge' && ' sent you a nudge!'}
                      {notification.type !== 'nudge' && notification.post?.title && (
                        <span className="text-white/60">: "{notification.post.title}"</span>
                      )}
                    </p>
                    
                    {/* Show comment content if it's a comment notification */}
                    {notification.type === 'comment' && notification.comment?.content && (
                      <p className="text-white/70 text-sm mt-1 italic">
                        "{notification.comment.content}"
                      </p>
                    )}
                    
                    {/* Show nudge message if it's a nudge notification */}
                    {notification.type === 'nudge' && notification.nudge?.message && (
                      <p className="text-white/70 text-sm mt-1 italic bg-pink-500/10 p-2 rounded border-l-2 border-pink-500/30">
                        💌 "{notification.nudge.message}"
                      </p>
                    )}
                    
                    <p className="text-white/50 text-xs mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      notification.type === 'nudge' ? 'bg-pink-500' : 'bg-purple-500'
                    }`}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
