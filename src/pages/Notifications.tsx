import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
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
    // Navigate to the specific post detail page
    navigate(`/post/${notification.post_id}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-black">
          <h2 className="text-2xl font-light mb-4">Please sign in to view notifications</h2>
          <Button onClick={() => navigate("/")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/community")}
          className="text-black hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-black text-xl font-medium">Notifications</h1>
        
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={markAllAsRead}
            className="text-purple-600 hover:bg-purple-50 text-sm"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-black mb-2">No notifications yet</h3>
            <p className="text-gray-600">
              You'll see notifications here when people like or comment on your posts.
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
                    ? 'bg-white border-gray-200 hover:bg-gray-50'
                    : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {notification.actor_profile?.avatar_url ? (
                      <img 
                        src={notification.actor_profile.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(notification.actor_profile?.username || 'User')
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-black text-sm">
                      <span className="font-semibold">{notification.actor_profile?.username}</span>
                      {notification.type === 'like' ? ' liked' : ' commented on'} your post
                      {notification.post?.title && (
                        <span className="text-gray-600">: "{notification.post.title}"</span>
                      )}
                    </p>
                    
                    {/* Show comment content if it's a comment notification */}
                    {notification.type === 'comment' && notification.comment?.content && (
                      <p className="text-gray-700 text-sm mt-1 italic">
                        "{notification.comment.content}"
                      </p>
                    )}
                    
                    <p className="text-gray-500 text-xs mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
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
