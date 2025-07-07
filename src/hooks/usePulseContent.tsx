
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

export const usePulseContent = () => {
  return useQuery({
    queryKey: ["pulse-content"],
    queryFn: async () => {
      console.log("Fetching pulse content...");
      
      const { data, error } = await supabase
        .from("pulse_content")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true });

      if (error) {
        console.error("Error fetching pulse content:", error);
        throw error;
      }

      console.log("Pulse content fetched:", data);

      if (!data) {
        return [];
      }

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        image_url: item.image_url,
        position: item.position,
        is_active: item.is_active,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })) as PulseContent[];
    },
  });
};
