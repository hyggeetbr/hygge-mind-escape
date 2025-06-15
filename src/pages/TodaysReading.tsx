
import React from "react";
import { useNavigate } from "react-router-dom";
import HomeButton from "@/components/HomeButton";

const ARTICLES = [
  {
    id: "the-illusion-of-freedom",
    title: "The Illusion of Freedom",
    author: "Ankit Vats"
  },
  {
    id: "at-war-i-go-outside",
    title: "At War: I Go Outside",
    author: "Ankit Vats"
  },
  {
    id: "memory",
    title: "Memory",
    author: "Ankit Vats"
  }
];

const TodaysReading: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-hygge-cream">
      <HomeButton />
      <div className="w-full flex flex-col items-center pt-8 pb-14 px-2 gap-8">
        <h1 className="font-display text-2xl md:text-3xl text-hygge-moss mb-4">Today's Reading</h1>
        <div className="flex flex-col gap-8 w-full items-center max-w-lg mx-auto">
          {ARTICLES.map((article) => (
            <button
              key={article.id}
              className="w-full rounded-2xl bg-white/90 border border-hygge-stone/30 shadow-md px-6 py-5 flex flex-col items-start hover:shadow-lg transition group outline-none focus:ring-2 focus:ring-hygge-sky"
              onClick={() => navigate(`/todays-reading/${article.id}`)}
              aria-label={`Read article: ${article.title}`}
            >
              <span className="font-display text-lg md:text-xl text-hygge-moss group-hover:underline">
                {article.title}
              </span>
              <span className="mt-1 text-hygge-stone text-base">
                By <span className="font-semibold">{article.author}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysReading;
