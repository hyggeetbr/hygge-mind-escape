import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleInteractions from "@/components/ArticleInteractions";
import { useArticleInteractions } from "@/hooks/useArticleInteractions";

type Article = {
  id: string;
  title: string;
  content: string | null;
  author: string | null;
  category: string | null;
  summary: string | null;
  estimated_read_minutes: number | null;
  url: string;
};

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { stats, addRead } = useArticleInteractions(id || '');

  useEffect(() => {
    if (id) {
      fetchArticle();
      // Add a read when the article is opened
      addRead();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-display text-white mb-4">Article not found</h2>
          <Button onClick={() => navigate('/todays-reading')} variant="outline" className="border-white text-white hover:bg-white hover:text-black">
            Back to Reading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            onClick={() => navigate('/todays-reading')}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reading
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          {/* Article Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-4 py-2 text-sm font-medium bg-white/20 text-white rounded-full border border-white/30">
                {article.category}
              </span>
              <div className="flex items-center gap-6 text-sm text-white/80">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                )}
                {article.estimated_read_minutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.estimated_read_minutes} min read</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{stats.reads} reads</span>
                </div>
              </div>
            </div>

            <h1 className="font-display text-3xl md:text-4xl text-white mb-4 leading-tight">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                {article.summary}
              </p>
            )}

            {/* Article Interactions */}
            <ArticleInteractions 
              articleId={article.id} 
              title={article.title} 
              showReads={true}
            />
          </div>

          {/* Article Body */}
          <div className="px-8 py-8">
            {article.content && (
              <div className="prose prose-lg max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-white/90 leading-relaxed mb-6 text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
