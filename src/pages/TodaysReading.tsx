
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HomeButton from "@/components/HomeButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReadingArticleCard from "@/components/ReadingArticleCard";
import { Loader2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
        <Loader2 className="animate-spin h-8 w-8 text-hygge-moss" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hygge-cream">
      <HomeButton />
      
      <div className="w-full max-w-4xl mx-auto pt-8 pb-14 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-hygge-moss mb-2">
            Today's Reading
          </h1>
          <p className="text-hygge-stone text-lg">
            Nourish your mind with wisdom
          </p>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 bg-white/60 border border-hygge-stone/20">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="font-medium text-hygge-earth data-[state=active]:bg-hygge-moss data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

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
          <div className="text-center text-hygge-stone mt-12">
            <p className="text-lg">No articles available at the moment.</p>
            <p className="text-sm mt-2">Please check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysReading;
