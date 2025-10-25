import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, title, message, type, actionUrl, metadata } =
      await req.json();

    // Create notification
    const { data, error } = await supabaseClient
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type: type || "system",
        action_url: actionUrl,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Send real-time notification
    await supabaseClient.channel("notifications").send({
      type: "broadcast",
      event: "notification",
      payload: {
        id: data.id,
        user_id: userId,
        title,
        message,
        type,
        action_url: actionUrl,
        created_at: data.created_at,
      },
    });

    return new Response(JSON.stringify({ success: true, notification: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
