
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeButton from "@/components/HomeButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ARTICLES = [
  {
    id: "the-illusion-of-freedom",
    title: "The Illusion of Freedom",
    author: "Ankit Vats",
    content: (
      <div>
        {/* Replace below with actual article HTML or markdown as needed */}
        <p>
          <strong>Excerpt/Placeholder:</strong>
          <br />
          This is the full content for "The Illusion of Freedom". Paste your full article text here.
        </p>
        <a
          className="text-hygge-sky underline"
          href="https://www.tumblr.com/theavtalks/747561886028103680/the-illusion-of-freedom?source=share"
          target="_blank"
          rel="noopener noreferrer"
        >
          View original on Tumblr
        </a>
      </div>
    ),
  },
  {
    id: "at-war-i-go-outside",
    title: "At War: I Go Outside",
    author: "Ankit Vats",
    content: (
      <div>
        {/*
          Replace below with actual article HTML or markdown as needed
        */}
        <p>
          <strong>Excerpt/Placeholder:</strong>
          <br />
          This is the full content for "At War: I Go Outside". Paste your full article text here.
        </p>
        <a
          className="text-hygge-sky underline"
          href="https://www.tumblr.com/theavtalks/727012363900977152/at-war-i-go-outside-mostly-for-a-walk-or-a-run?source=share"
          target="_blank"
          rel="noopener noreferrer"
        >
          View original on Tumblr
        </a>
      </div>
    ),
  },
  {
    id: "memory",
    title: "Memory",
    author: "Ankit Vats",
    content: (
      <div>
        {/*
          Replace below with actual article HTML or markdown as needed
        */}
        <p>
          <strong>Excerpt/Placeholder:</strong>
          <br />
          This is the full content for "Memory". Paste your full article text here.
        </p>
        <a
          className="text-hygge-sky underline"
          href="https://www.tumblr.com/theavtalks/715098282497622016/memory?source=share"
          target="_blank"
          rel="noopener noreferrer"
        >
          View original on Tumblr
        </a>
      </div>
    ),
  },
];

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const article = ARTICLES.find(({ id }) => id === articleId);

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">Article not found.</p>
          <Button className="mt-4" onClick={() => navigate("/todays-reading")}>
            Back to Today's Reading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-hygge-cream flex flex-col items-center">
      <HomeButton />
      <div className="w-full max-w-2xl mx-auto mt-10 px-4 pb-12 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="font-display text-3xl text-hygge-moss mb-2">{article.title}</h1>
        <div className="text-hygge-stone mb-6 text-base">By <span className="font-semibold">{article.author}</span></div>
        <div className="bg-white/90 rounded-2xl shadow border border-hygge-stone/30 p-6 prose max-w-none">
          {article.content}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
