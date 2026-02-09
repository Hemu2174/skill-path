import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { weekTitle, weekNumber, testScore, testPassed, correctAnswers, totalQuestions, isFinal, masteryLevel } = await req.json();

    // Fetch user goals for context
    const { data: goals } = await supabase.from("user_goals").select("*").eq("user_id", user.id).maybeSingle();

    let systemPrompt: string;

    if (isFinal) {
      systemPrompt = `You are an AI learning mentor. The learner has completed their Final Grand Assessment.

Learner Info:
- Career Goal: ${goals?.target_role || "Not set"}
- Experience Level: ${goals?.experience_level || "beginner"}

Final Assessment Results:
- Score: ${testScore}%
- Correct Answers: ${correctAnswers}/${totalQuestions}
- Mastery Level: ${masteryLevel}

Generate a comprehensive final report that includes:
1. **Overall Score** - A breakdown of their performance
2. **Strengths** - Areas where they excelled
3. **Weaknesses** - Areas that need improvement
4. **Mastery Level Assessment** - Justify the ${masteryLevel} classification
5. **Next Steps** - Concrete recommendations for continued growth

Keep the tone encouraging and actionable. Use markdown formatting.`;
    } else {
      systemPrompt = `You are an AI learning mentor providing weekly feedback after a test.

Learner Info:
- Career Goal: ${goals?.target_role || "Not set"}
- Experience Level: ${goals?.experience_level || "beginner"}

Week ${weekNumber}: ${weekTitle}
Test Results:
- Score: ${testScore}%
- Result: ${testPassed ? "PASSED" : "FAILED (needs to retake)"}
- Correct Answers: ${correctAnswers}/${totalQuestions}

${testPassed
  ? "Provide encouraging feedback, highlight what they did well, and suggest focus areas for the next week."
  : "Provide constructive feedback. Identify likely weak areas based on the score. Suggest specific review strategies and topics to focus on before retaking the test."}

Keep the response concise (3-5 paragraphs). Use markdown formatting.`;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Analyze my test results and provide personalized feedback." },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const feedback = aiData.choices?.[0]?.message?.content || "Unable to generate feedback at this time.";

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("weekly-feedback error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
