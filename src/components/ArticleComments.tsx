
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, User } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username?: string;
}

interface ArticleCommentsProps {
  articleId: string;
  commentsCount: number;
}

const ArticleComments: React.FC<ArticleCommentsProps> = ({ articleId, commentsCount }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [articleId, commentsCount]);

  const fetchComments = async () => {
    try {
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('article_comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        return;
      }

      // Fetch user profiles for usernames
      const userIds = [...new Set(commentsData?.map(comment => comment.user_id) || [])];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, username, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine comments with user info
      const commentsWithUsernames = commentsData?.map(comment => {
        const profile = profilesData?.find(p => p.id === comment.user_id);
        return {
          ...comment,
          username: profile?.username || profile?.full_name || 'Anonymous User'
        };
      }) || [];

      setComments(commentsWithUsernames);
    } catch (error) {
      console.error('Error in fetchComments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
        <div className="animate-pulse text-white/60">Loading comments...</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10 text-center">
        <MessageCircle className="w-8 h-8 text-white/40 mx-auto mb-3" />
        <p className="text-white/60">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-5 h-5 text-white/80" />
        <h3 className="text-xl font-display text-white">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white/5 rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-colors"
          >
            {/* Comment Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white/80" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-white">
                    {comment.username}
                  </span>
                  <span className="text-xs text-white/50">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Comment Content */}
            <div className="ml-11">
              <p className="text-white/90 leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleComments;
