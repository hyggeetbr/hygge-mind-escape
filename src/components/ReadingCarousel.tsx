
import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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
  const [activeIndex, setActiveIndex] = useState(0);

  if (!articles.length) {
    return (
      <div className="text-center text-gray-400 mt-12">No articles to show</div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <Carousel
        className="relative"
        opts={{ axis: "x", loop: false }}
      >
        <CarouselContent>
          {articles.map((article, idx) => (
            <CarouselItem key={article.id}>
              <div className="flex flex-col bg-white/90 border border-gray-200 rounded-2xl shadow-md p-6 gap-3 min-h-[350px] items-center">
                <h2 className="font-display text-xl text-hygge-moss text-center">{article.title}</h2>

                {!!article.summary ? (
                  <p className="mt-2 text-base text-gray-700 line-clamp-6 text-center">{article.summary}</p>
                ) : (
                  <div className="flex flex-col items-center gap-2 mt-2">
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

                <div className="flex justify-center w-full mt-auto">
                  <a
                    href={article.url}
                    className="inline-flex items-center text-hygge-sky underline hover:text-hygge-moss text-xs mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read Full Article <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
                <div className="text-hygge-sky/80 text-xs mt-2 text-center">{article.estimated_read_minutes ?? 5} min read</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ReadingCarousel;
