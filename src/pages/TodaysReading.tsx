
import React from "react";
import HomeButton from "@/components/HomeButton";

const ARTICLE_LINKS = [
  {
    url: "https://www.tumblr.com/theavtalks/747561886028103680/the-illusion-of-freedom?source=share",
    title: "The Illusion of Freedom"
  },
  {
    url: "https://www.tumblr.com/theavtalks/727012363900977152/at-war-i-go-outside-mostly-for-a-walk-or-a-run?source=share",
    title: "At War: I Go Outside"
  },
  {
    url: "https://www.tumblr.com/theavtalks/715098282497622016/memory?source=share",
    title: "Memory"
  }
];

const TodaysReading: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-hygge-cream">
      {/* Home Button */}
      <HomeButton />
      <div className="w-full flex flex-col items-center pt-6 pb-10 gap-8">
        <h1 className="font-display text-2xl md:text-3xl text-hygge-moss mb-2">Today's Reading</h1>
        <div className="flex flex-col gap-12 w-full items-center">
          {ARTICLE_LINKS.map((article, idx) => (
            <div
              key={article.url}
              className="w-full max-w-lg mx-auto bg-white/85 border border-hygge-stone/30 rounded-2xl shadow-md flex flex-col items-center p-0 overflow-hidden"
              style={{ minHeight: "70vh" }}
            >
              <div className="w-full py-3 px-4 text-center border-b border-hygge-stone/20">
                <span className="font-medium text-lg text-hygge-moss">
                  {article.title || `Article ${idx + 1}`}
                </span>
              </div>
              <iframe
                src={article.url}
                title={article.title || `Article ${idx + 1}`}
                className="w-full flex-1"
                style={{
                  height: '65vh',
                  border: 'none',
                  background: '#F5F3ED'
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysReading;
