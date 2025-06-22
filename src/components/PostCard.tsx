import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from 'lucide-react';
import { CommunityPost } from '@/hooks/useCommunityPosts';
import { formatDistanceToNow } from 'date-fns';
import { CommentsDialog } from './CommentsDialog';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => Promise<boolean>;
  onShare: (post: CommunityPost) => void;
  onGetComments: (postId: string) => Promise<any[]>;
  onDelete?: (postId: string) => Promise<boolean>;
  isOwnPost?: boolean;
}

export const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onGetComments, 
  onDelete,
  isOwnPost = false 
}: PostCardProps) => {
  const navigate = useNavigate();
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await onDelete(post.id);
      if (success) {
        setShowDeleteDialog(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUsernameClick = () => {
    // Don't navigate if it's the user's own post or if viewing from profile page
    if (!isOwnPost && post.user_id) {
      navigate(`/user/${post.user_id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
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
          <h4 
            className={`font-semibold text-black ${!isOwnPost ? 'cursor-pointer hover:text-purple-600' : ''}`}
            onClick={handleUsernameClick}
          >
            {post.user_profiles?.full_name || 'User'}
          </h4>
          <p className="text-gray-500 text-sm">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
        
        {/* Three dots menu for own posts */}
        {isOwnPost && onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-black hover:text-black">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
        <button 
          onClick={() => setShowCommentsDialog(true)}
          className="text-gray-500 hover:text-purple-600 cursor-pointer"
        >
          {post.comments_count || 0} comments
        </button>
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
          onClick={() => setShowCommentsDialog(true)}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500 hover:text-purple-600"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </Button>

        <Button
          onClick={() => onShare(post)}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </Button>
      </div>

      {/* Comments Dialog */}
      <CommentsDialog
        open={showCommentsDialog}
        onClose={() => setShowCommentsDialog(false)}
        postId={post.id}
        onGetComments={onGetComments}
        onAddComment={onComment}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white border border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete your post and remove all associated comments and likes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowDeleteDialog(false)}
              className="bg-gray-100 text-black hover:bg-gray-200"
            >
              NO
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'YES'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
