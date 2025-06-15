
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
      <div className="prose max-w-none">
        <p>
          <strong>The Illusion of Freedom</strong>
        </p>
        <p>
          The so-called freedom of life, or the liberties we believe we have, are always bracketed by conditions. When I think about freedom, I recall my most carefree moments, but in truth, even then, I was never truly out of consequence and circumstance. The dignity of choice is amusingly dependent on the frameworks and cages we maneuver within, no matter how invisible they are. 
        </p>
        <p>
          For most people—including myself—there is always the thought: "If only XYZ wasn't true, I'd be free." If money wasn't an issue, health wasn’t frail, parents weren't aging, if only I didn’t have to work here, if only I was thinner/richer/more successful. But freedom is never about the absence of obstacles. It’s about the presence of self.
        </p>
        <p>
          I have run away from circumstances, jobs, relationships, and even cities—but I always found myself imprisoned in new cages, designed by new rules. Because the world, no matter where you go, demands you behave in a certain way for survival, for belonging, for validation, for peace. 
        </p>
        <p>
          Real freedom is not the lack of demands or consequence, but the ability to choose meaningfully, knowing that every choice brings new restrictions and new joys. The birdsong outside my window this morning—was the bird free? It may leave the branch and soar, but even its wings are chained by hunger, weather, instinct, by the dangers of the sky and the need for shelter. 
        </p>
        <p>
          The illusion is when we believe that one day, someday, conditions will disappear, and we will finally be free—to act, to love, to live. But living is precisely this fray of constraints, and freedom is the dance we do inside our little cages. The real trick is to find the beauty in the movement, and in the cage itself.
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
      <div className="prose max-w-none">
        <p>
          <strong>At War: I Go Outside</strong>
        </p>
        <p>
          Mostly for a walk, or a run, or to get milk or bread. Sometimes because the sunlight calls for me, or sometimes because I must exhaust my mind by wearing out my legs. Once, I used to believe that to step outside meant escaping the inner tangle. But the mind comes along, even under this new sky and among indifferent trees, and so I walk further, hoping that somewhere, the war in my head will run out of breath before my body does.
        </p>
        <p>
          Some days it works. The sun splinters on my eyelids and the air tastes of the coming rain or passing smokers, and for a moment, my thoughts are only about the lilt of my own step, about the cracks in the pavement, the way dog-leashes move like skipping ropes, poorly controlled. There is an accidental peace, as if I have tricked my adversary—myself—by switching battlefields.
        </p>
        <p>
          But the war is patient. It’ll find me by the corner of the 7-11, or in the last turn before home. Like a tune you can’t shake off, or a shadow you were sure you outran. Sometimes, at the crosswalk, I catch myself pausing, not for the light, but to negotiate another treaty inside my skull.
        </p>
        <p>
          Still, I go outside. I always return, but a little less heavy with my own thinking, or at least my mind better camouflaged among the noise and strangers and the grand indifference of things beyond me. Maybe that’s all there is: not the end of the war, but little moments on the battlefield where the sun is warm, and you do not mind the waiting.
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
      <div className="prose max-w-none">
        <p>
          <strong>Memory</strong>
        </p>
        <p>
          Memory is not a stable photograph but a messy, changing mural. It stores not only what happened, but how we felt about it at the time—each recall painted over with a little more hope or shame, pride or loss. Sometimes, I find myself doubting if a conversation went the way I recall, or if it ever occurred at all. Just as frequently, I rewatch a happy memory and find rough edges, places where pain or awkwardness had been edited out by some tender part of myself.
        </p>
        <p>
          In this way, memory is an act of kindness, sometimes self-deception. It is how we survive the past and remain whole. Which is why I have learned to hold my recollections lightly, allowing that I might be both the liar and the lied-to. The stories we tell about ourselves aren’t always meant to deceive others, but to help ourselves live with what was and build a version of what might still be.
        </p>
        <p>
          I try to remember, then, that every person I meet is also made from this careful, creative remembering. And even if our versions don’t match, there is something deeply human in the way we each tend to our wounds by retelling their origin.
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
