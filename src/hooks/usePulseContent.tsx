
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PulseContent {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Type for the raw database response
interface PulseContentRow {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePulseContent = () => {
  return useQuery({
    queryKey: ["pulse-content"],
    queryFn: async () => {
      console.log("Fetching pulse content...");
      
      // Use direct SQL query to avoid TypeScript issues
      const { data, error } = await supabase.rpc('get_pulse_content');

      if (error) {
        console.error("Error fetching pulse content:", error);
        // Fallback to direct table query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("pulse_content" as any)
          .select("*")
          .eq("is_active", true)
          .order("position", { ascending: true });

        if (fallbackError) {
          console.error("Fallback error:", fallbackError);
          throw fallbackError;
        }

        const typedData = fallbackData as PulseContentRow[];
        console.log("Pulse content fetched (fallback):", typedData);

        return typedData?.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          image_url: item.image_url,
          position: item.position,
          is_active: item.is_active,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })) as PulseContent[] || [];
      }

      console.log("Pulse content fetched:", data);
      return data as PulseContent[] || [];
    },
  });
};
