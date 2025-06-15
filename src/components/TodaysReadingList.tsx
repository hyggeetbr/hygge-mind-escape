
import React from "react";
import { Button } from "@/components/ui/button";

type Article = {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  estimated_read_minutes: number | null;
};

interface TodaysReadingListProps {
  articles: Article[];
  todaysMinutes: number;
  isReading: boolean;
  sessionLoading: boolean;
  selectedArticle: Article | null;
  onStartReading: (article: Article) => void;
}

const TodaysReadingList: React.FC<TodaysReadingListProps> = ({
  articles,
  todaysMinutes,
  isReading,
  sessionLoading,
  selectedArticle,
  onStartReading,
}) => {
  return (
    <div className="relative z-10 flex flex-col items-center w-[90vw] max-w-2xl px-5 py-10 rounded-2xl shadow-xl bg-white/80 border-2 border-hygge-stone/20 animate-fade-in">
      <h1 className="font-display text-2xl md:text-3xl text-hygge-moss mb-4">
        Today's Reading
      </h1>
      <div className="text-hygge-moss/80 mb-6 font-light">
        Read at least 10 minutes daily to grow mindful. <br />{" "}
        <span className="text-hygge-earth/60">You've read <span className="font-bold text-hygge-moss">{todaysMinutes} min</span> today.</span>
      </div>
      <div className="grid gap-5 w-full">
        {articles.map((article) => (
          <div
            key={article.id}
            className="border border-hygge-sage/40 rounded-xl px-6 py-5 bg-hygge-mist/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between items-start gap-3"
          >
            <div>
              <div className="font-display text-lg text-hygge-moss mb-1">{article.title}</div>
              <div className="text-hygge-earth/80 text-sm mb-2">{article.summary}</div>
              <div className="text-hygge-sky/80 text-xs mb-1">{article.estimated_read_minutes ?? 5} min read</div>
              <a
                href={article.url}
                className="text-hygge-moss underline text-xs"
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
              >
                External link
              </a>
            </div>
            <Button
              className="mt-2 w-full md:w-auto bg-white text-black border border-hygge-stone"
              variant="plain"
              onClick={() => onStartReading(article)}
              disabled={isReading || sessionLoading}
            >
              {isReading && selectedArticle?.id === article.id ? 'Reading…' : 'Read'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysReadingList;
