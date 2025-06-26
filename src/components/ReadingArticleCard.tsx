
import React from "react";
import { Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-hygge-stone/20 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header with category badge */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-hygge-moss/10 text-hygge-moss rounded-full border border-hygge-moss/20">
            {article.category}
          </span>
          <div className="flex items-center gap-4 text-xs text-hygge-stone">
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
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display text-xl md:text-2xl text-hygge-moss mb-3 leading-tight">
          {article.title}
        </h2>

        {/* Summary */}
        {article.summary && (
          <p className="text-hygge-earth text-base leading-relaxed mb-4 line-clamp-3">
            {article.summary}
          </p>
        )}

        {/* Content Preview */}
        {article.content && (
          <div className="mb-6">
            <p className="text-hygge-stone text-sm leading-relaxed line-clamp-4">
              {article.content.substring(0, 200)}
              {article.content.length > 200 && "..."}
            </p>
          </div>
        )}
      </div>

      {/* Footer with read button */}
      <div className="px-6 pb-6">
        <Button
          onClick={onRead}
          className="w-full bg-hygge-moss hover:bg-hygge-moss/90 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Read Article
        </Button>
      </div>
    </div>
  );
};

export default ReadingArticleCard;
