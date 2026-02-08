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

    // Fetch all user data in parallel
    const [goalsRes, assessmentsRes, tasksRes, reportsRes, skillsRes] = await Promise.all([
      supabase.from("user_goals").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("assessments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
      supabase.from("tasks").select("*, roadmap_weeks!inner(week_number, title)").eq("user_id", user.id),
      supabase.from("weekly_reports").select("*").eq("user_id", user.id).order("week_number", { ascending: false }).limit(3),
      supabase.from("assessments").select("answers, score").eq("user_id", user.id).eq("assessment_type", "skill_quiz"),
    ]);

    const goals = goalsRes.data;
    const tasks = tasksRes.data || [];
    const reports = reportsRes.data || [];
    const assessment = assessmentsRes.data?.[0];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.is_completed).length;
    const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Derive skill areas from tasks grouped by week
    const weekMap: Record<string, { title: string; completed: number; total: number }> = {};
    tasks.forEach((t: any) => {
      const wk = t.roadmap_weeks as any;
      const key = t.week_id;
      if (!weekMap[key]) weekMap[key] = { title: wk?.title || "Unknown", completed: 0, total: 0 };
      weekMap[key].total++;
      if (t.is_completed) weekMap[key].completed++;
    });

    const skillsJson = Object.values(weekMap).map((w) => ({
      skill: w.title,
      proficiency: w.total > 0 ? Math.round((w.completed / w.total) * 100) : 0,
    }));

    const weeklySummary = reports.map((r: any) =>
      `Week ${r.week_number}: ${r.tasks_completed} tasks, ${r.hours_spent}h, score ${r.progress_score}%`
    ).join("\n") || "No weekly reports yet.";

    const systemPrompt = `You are an AI learning mentor. Analyze the learner's data and generate personalized learning recommendations.

Learner Profile:
- Career Goal: ${goals?.target_role || "Not set"}
- Experience Level: ${goals?.experience_level || "beginner"}
- Weekly Learning Hours: ${goals?.weekly_hours || 10}

Skill Assessment Scores:
${JSON.stringify(skillsJson, null, 2)}

Learning Progress:
- Total Tasks: ${totalTasks}
- Completed Tasks: ${completedTasks}
- Current Completion Percentage: ${completionPct}%

Recent Weekly Activity:
${weeklySummary}

Instructions:
1. Identify the learner's strongest and weakest skills.
2. Recommend 3–5 learning topics aligned with the career goal.
3. Suggest 2 practical mini-project ideas suitable for the learner's level.
4. Provide actionable advice for improving weak skills.
5. Keep the tone motivating and concise.

Output Format (use markdown):
## Skill Insights
## Recommended Learning Topics
## Project Suggestions
## Improvement Advice`;

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
          { role: "user", content: "Analyze my learning data and provide personalized recommendations." },
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-mentor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
