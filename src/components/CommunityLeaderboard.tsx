
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  likes_count: number;
  rank: number;
}

export const CommunityLeaderboard = () => {
  const [topContributors, setTopContributors] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopContributors();
  }, []);

  const loadTopContributors = async () => {
    setLoading(true);
    try {
      // First, get all community posts with their user information
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select(`
          id,
          user_id,
          user_profiles!inner(username)
        `);

      if (postsError) {
        console.error('Error loading posts:', postsError);
        return;
      }

      console.log('Posts data:', postsData);

      if (!postsData || postsData.length === 0) {
        setTopContributors([]);
        setLoading(false);
        return;
      }

      // Now get likes count for each post
      const userLikesMap = new Map<string, { username: string; likes_count: number }>();

      for (const post of postsData) {
        const { data: likesData, error: likesError } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', post.id);

        if (likesError) {
          console.error('Error loading likes for post:', post.id, likesError);
          continue;
        }

        const likesCount = likesData?.length || 0;
        const userId = post.user_id;
        const username = post.user_profiles?.username || 'User';

        console.log(`Post ${post.id} by ${username}: ${likesCount} likes`);

        if (userLikesMap.has(userId)) {
          userLikesMap.get(userId)!.likes_count += likesCount;
        } else {
          userLikesMap.set(userId, { username, likes_count: likesCount });
        }
      }

      console.log('User likes map:', userLikesMap);

      // Convert to array and sort by likes count
      const sortedContributors = Array.from(userLikesMap.entries())
        .map(([user_id, data]) => ({
          user_id,
          username: data.username,
          likes_count: data.likes_count,
          rank: 0
        }))
        .sort((a, b) => b.likes_count - a.likes_count)
        .slice(0, 3) // Top 3 only
        .map((contributor, index) => ({
          ...contributor,
          rank: index + 1
        }));

      console.log('Sorted contributors:', sortedContributors);
      setTopContributors(sortedContributors);
    } catch (error) {
      console.error('Error processing leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-100 border-amber-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (topContributors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-black text-lg font-medium">
            No contributions yet.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Be the first to share a post and get likes!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-black text-xl font-semibold mb-6 text-center">
          🏆 Top Contributors
        </h3>
        
        <div className="space-y-4">
          {topContributors.map((contributor) => (
            <div
              key={contributor.user_id}
              className={`p-4 rounded-lg border-2 ${getRankColor(contributor.rank)} transform transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getMedalIcon(contributor.rank)}
                    <span className="text-2xl font-bold text-gray-700">
                      #{contributor.rank}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {contributor.username}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Community Contributor
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {contributor.likes_count}
                  </div>
                  <div className="text-xs text-gray-500">
                    total likes
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            Rankings are based on total likes received on all posts
          </p>
        </div>
      </div>
    </div>
  );
};
