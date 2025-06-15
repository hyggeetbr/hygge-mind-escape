import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";

type Article = {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  estimated_read_minutes: number | null;
};

type ReadingSession = {
  id: string;
  article_id: string;
  user_id: string;
  date: string;
  duration_minutes: number;
  created_at: string;
};

const TodaysReading = () => {
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [readingSeconds, setReadingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [todaysMinutes, setTodaysMinutes] = useState<number>(0);

  // Fetch articles from Supabase
  useEffect(() => {
    (async () => {
      // Get only short articles
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .gte("estimated_read_minutes", 5)
        .lte("estimated_read_minutes", 10)
        .order("created_at", { ascending: false });
      if (error || !data || data.length === 0) {
        // fallback demo items
        setArticles([
          {
            id: "demo-1",
            title: "Mindful Minutes: 7 Small Habits",
            url: "https://blog.example.com/mindful-habits",
            summary: "Adopt 7 bite-sized habits for a calmer, more present day.",
            estimated_read_minutes: 7,
          },
          {
            id: "demo-2",
            title: "Nutrition for Focus",
            url: "https://blog.example.com/nutrition-focus",
            summary: "The foods that sharpen your meditation and mindfulness.",
            estimated_read_minutes: 9,
          },
          {
            id: "demo-3",
            title: "5-Minute Reflection Routine",
            url: "https://blog.example.com/quick-reflection",
            summary: "A fast way to reset and ground yourself between tasks.",
            estimated_read_minutes: 5,
          },
        ]);
      } else {
        setArticles(data);
      }
    })();
  }, []);

  // Auth gate
  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/", { replace: true });
    }
  }, [userLoading, user, navigate]);

  // Fetch today's total read minutes
  const fetchTodaysMinutes = useCallback(async () => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("reading_sessions")
      .select("duration_minutes")
      .eq("user_id", user.id)
      .eq("date", today);

    if (error) return setTodaysMinutes(0);
    setTodaysMinutes(
      data.reduce((acc: number, row: { duration_minutes: number }) => acc + (row.duration_minutes || 0), 0)
    );
  }, [user]);

  useEffect(() => {
    fetchTodaysMinutes();
  }, [fetchTodaysMinutes, user]);

  // Timer logic
  useEffect(() => {
    if (isReading) {
      timerRef.current = setInterval(() => {
        setReadingSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isReading]);

  // Start reading an article
  const handleStartReading = (article: Article) => {
    setSelectedArticle(article);
    setIsReading(true);
    setReadingSeconds(0);
  };

  // End reading and save session in database
  const handleFinishReading = async () => {
    setIsReading(false);
    setSessionLoading(true);

    if (user && selectedArticle) {
      const durationInMinutes = Math.max(1, Math.round(readingSeconds / 60)); // round up, at least 1 min
      const today = new Date().toISOString().slice(0, 10);

      await supabase.from("reading_sessions").insert({
        article_id: selectedArticle.id,
        user_id: user.id,
        date: today,
        duration_minutes: durationInMinutes,
      });

      setReadingSeconds(0);
      setSelectedArticle(null);
      fetchTodaysMinutes();
    } else {
      // Should never happen
      alert("Cannot save session, please login again.");
    }
    setSessionLoading(false);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
        <Loader2 className="animate-spin text-hygge-moss" size={32} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-hygge-cream overflow-hidden">
      {/* Home Button */}
      <HomeButton />
      {/* Bubbles */}
      <div>
        <div className="absolute top-20 left-8 w-32 h-32 bg-hygge-sage/10 rounded-full blur-2xl animate-float pointer-events-none" />
        <div className="absolute bottom-24 right-16 w-24 h-24 bg-hygge-mist/20 rounded-full blur-lg" />
      </div>

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
                onClick={() => handleStartReading(article)}
                disabled={isReading || sessionLoading}
              >
                {isReading && selectedArticle?.id === article.id ? 'Reading…' : 'Read'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Dialog */}
      <Dialog open={!!selectedArticle && isReading} onOpenChange={(open) => { if (!open) setIsReading(false); }}>
        <DialogContent className="max-w-xl bg-white/90">
          <DialogHeader>
            <DialogTitle>
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 items-center">
            {selectedArticle && (
              <>
                <div className="mb-2 text-hygge-earth/70 text-center">{selectedArticle.summary}</div>
                <iframe
                  src={selectedArticle.url}
                  title={selectedArticle.title}
                  className="w-full h-60 max-w-lg rounded border"
                  style={{ minHeight: 200 }}
                />
                <div className="font-mono text-hygge-moss text-lg mb-1">
                  Time: <span>{Math.floor(readingSeconds / 60)}:{("0" + (readingSeconds % 60)).slice(-2)}</span>
                </div>
                <Button
                  onClick={handleFinishReading}
                  className="w-full bg-white text-black border border-hygge-stone"
                  variant="plain"
                  disabled={sessionLoading}
                >
                  {sessionLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Finish & Save"}
                </Button>
                <DialogClose asChild>
                  <button
                    className="text-xs text-hygge-sky underline mt-2"
                    onClick={() => setIsReading(false)}
                  >
                    Cancel
                  </button>
                </DialogClose>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodaysReading;
