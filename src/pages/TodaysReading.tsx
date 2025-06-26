import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HomeButton from "@/components/HomeButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReadingArticleCard from "@/components/ReadingArticleCard";
import SavedArticles from "@/components/SavedArticles";
import { Loader2, Bookmark } from "lucide-react";
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

const TodaysReading: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showSavedArticles, setShowSavedArticles] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      setArticles(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data?.map(article => article.category).filter(Boolean))
      ) as string[];
      
      setCategories(uniqueCategories);
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => article.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin h-8 w-8 text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <HomeButton />
      
      <div className="w-full max-w-6xl mx-auto pt-8 pb-14 px-4">
        {/* Header with Saves button */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl md:text-4xl text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Hygge Reads
          </h1>
          <p className="text-white/80 text-lg">
            Nourish your mind with wisdom
          </p>
          
          {/* Saves button - positioned as ribbon in top right */}
          <Button
            onClick={() => setShowSavedArticles(true)}
            variant="ghost"
            className="absolute top-0 right-0 text-white hover:bg-white/10 flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-sm">Saves</span>
          </Button>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="w-full overflow-x-auto mb-8">
              <TabsList className="flex w-max min-w-full bg-white/10 border border-white/20 h-12 p-1 rounded-lg">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="font-medium text-white data-[state=active]:bg-white data-[state=active]:text-black text-sm px-6 py-2 rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="space-y-6">
                  {getArticlesByCategory(category).map((article) => (
                    <ReadingArticleCard
                      key={article.id}
                      article={article}
                      onRead={() => navigate(`/todays-reading/${article.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {categories.length === 0 && (
          <div className="text-center text-white/80 mt-12">
            <p className="text-lg">No articles available at the moment.</p>
            <p className="text-sm mt-2">Please check back later for new content.</p>
          </div>
        )}
      </div>

      {/* Saved Articles Sidebar */}
      <SavedArticles
        isOpen={showSavedArticles}
        onClose={() => setShowSavedArticles(false)}
      />
    </div>
  );
};

export default TodaysReading;
