
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { CommunityPost, PostComment } from '@/hooks/useCommunityPosts';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => Promise<boolean>;
  onShare: (post: CommunityPost) => void;
  onGetComments: (postId: string) => Promise<PostComment[]>;
}

export const PostCard = ({ post, onLike, onComment, onShare, onGetComments }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const handleShowComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      const postComments = await onGetComments(post.id);
      setComments(postComments);
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const success = await onComment(post.id, newComment);
    if (success) {
      setNewComment('');
      // Refresh comments
      const updatedComments = await onGetComments(post.id);
      setComments(updatedComments);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-calm-purple to-calm-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {post.user_profiles?.avatar_url ? (
            <img 
              src={post.user_profiles.avatar_url} 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(post.user_profiles?.full_name || 'User')
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-black">
            {post.user_profiles?.full_name || 'Anonymous User'}
          </h4>
          <p className="text-gray-500 text-sm">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-black mb-2">{post.title}</h3>
        <p className="text-black leading-relaxed whitespace-pre-wrap">{post.description}</p>
      </div>

      {/* Post Image */}
      {post.image_url && (
        <div className="mb-4">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full rounded-lg object-cover max-h-96"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-gray-500 text-sm mb-4 pt-2 border-t border-gray-100">
        <span>{post.likes_count || 0} likes</span>
        <span>{post.comments_count || 0} comments</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between py-2 border-t border-gray-100">
        <Button
          onClick={() => onLike(post.id)}
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-2 ${
            post.user_has_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${post.user_has_liked ? 'fill-current' : ''}`} />
          <span>Love</span>
        </Button>

        <Button
          onClick={handleShowComments}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500 hover:text-calm-purple"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </Button>

        <Button
          onClick={() => onShare(post)}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500 hover:text-calm-blue"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          {/* Add Comment */}
          <div className="flex items-end space-x-2 mb-4">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 min-h-[40px] resize-none bg-white text-black border-gray-300 placeholder:text-gray-500"
              rows={1}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              size="sm"
              className="bg-calm-purple hover:bg-calm-purple/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Comments List */}
          {loadingComments ? (
            <div className="text-center text-gray-500 py-4">Loading comments...</div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-calm-purple to-calm-blue rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {getInitials(comment.user_profiles?.full_name || 'User')}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                      <p className="font-semibold text-sm text-black">
                        {comment.user_profiles?.full_name || 'Anonymous User'}
                      </p>
                      <p className="text-black text-sm">{comment.content}</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
