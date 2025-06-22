
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { PostComment } from '@/hooks/useCommunityPosts';
import { formatDistanceToNow } from 'date-fns';

interface CommentsDialogProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  onGetComments: (postId: string) => Promise<PostComment[]>;
  onAddComment: (postId: string, content: string) => Promise<boolean>;
}

export const CommentsDialog = ({ 
  open, 
  onClose, 
  postId, 
  onGetComments, 
  onAddComment 
}: CommentsDialogProps) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      const postComments = await onGetComments(postId);
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const success = await onAddComment(postId, newComment);
      if (success) {
        setNewComment('');
        // Refresh comments
        await loadComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  useEffect(() => {
    if (open && postId) {
      loadComments();
    }
  }, [open, postId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Comments</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-4">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {getInitials(comment.user_profiles?.full_name || 'User')}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                      <p className="font-semibold text-sm text-black mb-1">
                        {comment.user_profiles?.full_name || 'User'}
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

        {/* Add Comment */}
        <div className="flex items-end space-x-2 pt-4 border-t border-gray-200">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-h-[40px] resize-none bg-white text-black border-gray-300 placeholder:text-gray-500"
            rows={1}
          />
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || submitting}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
