
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { X, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SavedArticle {
  id: string;
  article: {
    id: string;
    title: string;
    author: string | null;
    category: string | null;
    estimated_read_minutes: number | null;
  };
}

interface SavedArticlesProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedArticles: React.FC<SavedArticlesProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedArticles = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('article_saves')
        .select(`
          id,
          article:articles(
            id,
            title,
            author,
            category,
            estimated_read_minutes
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved articles:', error);
        return;
      }

      setSavedArticles(data || []);
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchSavedArticles();
    }
  }, [isOpen, user]);

  const handleRemoveSave = async (saveId: string) => {
    try {
      await supabase
        .from('article_saves')
        .delete()
        .eq('id', saveId);

      setSavedArticles(prev => prev.filter(item => item.id !== saveId));
    } catch (error) {
      console.error('Error removing save:', error);
    }
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/todays-reading/${articleId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-white/20 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-white" />
              <h2 className="text-xl font-display text-white">Saved Articles</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center text-white/60 py-8">
                Loading saved articles...
              </div>
            ) : savedArticles.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-white/40" />
                <p>No saved articles yet</p>
                <p className="text-sm mt-2">Articles you save will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedArticles.map((saved) => (
                  <div
                    key={saved.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 hover:bg-white/15 transition-colors cursor-pointer"
                    onClick={() => handleArticleClick(saved.article.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium leading-tight mb-2 line-clamp-2">
                          {saved.article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          {saved.article.category && (
                            <span className="px-2 py-1 bg-white/20 rounded-full">
                              {saved.article.category}
                            </span>
                          )}
                          {saved.article.author && (
                            <span>{saved.article.author}</span>
                          )}
                          {saved.article.estimated_read_minutes && (
                            <span>{saved.article.estimated_read_minutes} min read</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSave(saved.id);
                        }}
                        className="text-white/60 hover:text-white hover:bg-white/10 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedArticles;
