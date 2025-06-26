
import React from "react";
import { Clock, User, Heart, MessageCircle, Bookmark, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface ReadingArticleCardProps {
  article: Article;
  onRead: () => void;
}

const ReadingArticleCard: React.FC<ReadingArticleCardProps> = ({
  article,
  onRead,
}) => {
  const { stats, addRead } = useArticleInteractions(article.id);

  const handleReadClick = () => {
    addRead();
    onRead();
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header with category badge */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-white/20 text-white rounded-full border border-white/30">
            {article.category}
          </span>
          <div className="flex items-center gap-4 text-xs text-white/80">
            {article.author && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{article.author}</span>
              </div>
            )}
            {article.estimated_read_minutes && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.estimated_read_minutes} min read</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{stats.reads} reads</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display text-xl md:text-2xl text-white mb-3 leading-tight">
          {article.title}
        </h2>

        {/* Summary */}
        {article.summary && (
          <p className="text-white/80 text-base leading-relaxed mb-4 line-clamp-3">
            {article.summary}
          </p>
        )}

        {/* Content Preview */}
        {article.content && (
          <div className="mb-6">
            <p className="text-white/70 text-sm leading-relaxed line-clamp-4">
              {article.content.substring(0, 200)}
              {article.content.length > 200 && "..."}
            </p>
          </div>
        )}

        {/* Interaction Stats */}
        <div className="flex items-center gap-6 mb-4 text-xs text-white/60">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{stats.likes} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{stats.comments} comments</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="w-4 h-4" />
            <span>{stats.saves} saves</span>
          </div>
        </div>
      </div>

      {/* Footer with read button */}
      <div className="px-6 pb-6">
        <Button
          onClick={handleReadClick}
          className="w-full bg-white hover:bg-white/90 text-black font-medium py-3 rounded-xl transition-colors"
        >
          Read Article
        </Button>
      </div>
    </div>
  );
};

export default ReadingArticleCard;
