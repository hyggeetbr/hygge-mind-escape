
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useArticleInteractions } from '@/hooks/useArticleInteractions';
import { toast } from '@/hooks/use-toast';

interface ArticleInteractionsProps {
  articleId: string;
  title: string;
  showReads?: boolean;
}

const ArticleInteractions: React.FC<ArticleInteractionsProps> = ({
  articleId,
  title,
  showReads = false,
}) => {
  const { stats, loading, toggleLike, toggleSave, addComment } = useArticleInteractions(articleId);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Article link has been copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    
    await addComment(commentText);
    setCommentText('');
    setShowCommentInput(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main interaction buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Like */}
          <button
            onClick={toggleLike}
            disabled={loading}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${stats.isLiked ? 'fill-red-500 text-red-500' : ''}`}
            />
            <span className="text-sm">{stats.likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{stats.comments}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Share className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>

          {/* Reads (if enabled) */}
          {showReads && (
            <div className="flex items-center gap-2 text-white/60">
              <Eye className="w-5 h-5" />
              <span className="text-sm">{stats.reads} reads</span>
            </div>
          )}
        </div>

        {/* Save */}
        <button
          onClick={toggleSave}
          disabled={loading}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <Bookmark
            className={`w-5 h-5 ${stats.isSaved ? 'fill-white text-white' : ''}`}
          />
          <span className="text-sm">{stats.saves}</span>
        </button>
      </div>

      {/* Comment input */}
      {showCommentInput && (
        <div className="flex flex-col gap-3 mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCommentInput(false);
                setCommentText('');
              }}
              className="text-white/80 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleComment}
              size="sm"
              className="bg-white text-black hover:bg-white/90"
              disabled={!commentText.trim()}
            >
              Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleInteractions;
