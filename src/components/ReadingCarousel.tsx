
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Sparkles } from "lucide-react";

type Article = {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  estimated_read_minutes: number | null;
};

interface ReadingCarouselProps {
  articles: Article[];
  onSummarize: (article: Article) => void;
  summarizingId: string | null;
}

const ReadingCarousel: React.FC<ReadingCarouselProps> = ({
  articles,
  onSummarize,
  summarizingId,
}) => {
  if (!articles.length) {
    return (
      <div className="text-center text-gray-400 mt-12">No articles to show</div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-10 md:pt-16 flex flex-col items-center bg-hygge-cream overflow-y-auto">
      <div className="flex flex-col gap-8 w-full items-center">
        {articles.map((article) => (
          <div
            key={article.id}
            className="max-w-md w-[94vw] min-h-[65vh] bg-white/90 border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col justify-between mx-auto transition-shadow"
          >
            <div>
              <h2 className="font-display text-xl md:text-2xl text-hygge-moss text-center mb-4">{article.title}</h2>
              {article.summary ? (
                <p className="mt-2 text-base text-gray-700 text-center mb-2">{article.summary}</p>
              ) : (
                <div className="flex flex-col items-center gap-3 my-4">
                  <span className="text-hygge-earth/70 text-sm italic">
                    No summary available for this article.
                  </span>
                  <Button
                    size="sm"
                    className="gap-1 bg-white border border-hygge-stone text-hygge-moss"
                    variant="plain"
                    onClick={() => onSummarize(article)}
                    disabled={summarizingId === article.id}
                  >
                    {summarizingId === article.id ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-1" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1" />
                        Summarize with AI
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center mt-6">
              <a
                href={article.url}
                className="inline-flex items-center text-hygge-sky underline hover:text-hygge-moss text-xs mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read Full Article <ExternalLink className="ml-1 h-4 w-4" />
              </a>
              <div className="text-hygge-sky/80 text-xs">{article.estimated_read_minutes ?? 5} min read</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingCarousel;
