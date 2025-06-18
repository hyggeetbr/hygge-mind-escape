
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const openAIApiKey =
  Deno.env.get("OPENAI_API_KEY") || Deno.env.get("VITE_OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, articleId } = await req.json();

    // 1. Fetch article content.
    const articleContentResp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      },
    });
    const html = await articleContentResp.text();

    // 2. Extract readable text (basic, naive — could be improved)
    const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHTML = match ? match[1] : html;
    const cleanText = bodyHTML
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // 3. Call OpenAI to summarize
    const prompt = `Summarize this article in 2-4 sentences for a mindful, positive reading app. Be concise and highlight the main takeaway. Here is the article text:\n\n${cleanText.slice(
      0,
      8000
    )}`;

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI who summarizes news for a mindfulness app.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
          max_tokens: 220,
        }),
      }
    );

    const aiData = await aiResponse.json();
    const summary =
      aiData.choices?.[0]?.message?.content?.trim() ||
      "Summary not available.";

    // 4. Store in DB (articles.summary)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    // Update article
    await supabase
      .from("articles")
      .update({ summary })
      .eq("id", articleId);

    // 5. Return response
    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("summarize-article error:", e);
    return new Response(JSON.stringify({ error: "Error summarizing." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
