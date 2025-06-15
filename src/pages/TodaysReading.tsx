
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/HomeButton";
import ReadingDialog from "@/components/ReadingDialog";
import TodaysReadingList from "@/components/TodaysReadingList";

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
      <TodaysReadingList
        articles={articles}
        todaysMinutes={todaysMinutes}
        isReading={isReading}
        sessionLoading={sessionLoading}
        selectedArticle={selectedArticle}
        onStartReading={handleStartReading}
      />
      <ReadingDialog
        open={!!selectedArticle && isReading}
        isReading={isReading}
        selectedArticle={selectedArticle}
        readingSeconds={readingSeconds}
        sessionLoading={sessionLoading}
        onFinishReading={handleFinishReading}
        onCancel={() => setIsReading(false)}
      />
    </div>
  );
};

export default TodaysReading;
