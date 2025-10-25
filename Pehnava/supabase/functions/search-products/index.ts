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
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("q") || "";
    const gender = url.searchParams.get("gender") || "";
    const occasion = url.searchParams.get("occasion") || "";
    const category = url.searchParams.get("category") || "";
    const minPrice = url.searchParams.get("min_price") || "";
    const maxPrice = url.searchParams.get("max_price") || "";
    const sortBy = url.searchParams.get("sort_by") || "created_at";
    const sortOrder = url.searchParams.get("sort_order") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    let query = supabaseClient.from("products").select(
      `
        *,
        product_images(*),
        product_variants(*),
        categories(*)
      `,
      { count: "exact" }
    );

    // Apply filters
    if (searchQuery) {
      query = query.textSearch("name", searchQuery);
    }
    if (gender) {
      query = query.eq("gender", gender);
    }
    if (occasion) {
      query = query.eq("occasion", occasion);
    }
    if (category) {
      query = query.eq("category_id", category);
    }
    if (minPrice) {
      query = query.gte("base_price", parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte("base_price", parseFloat(maxPrice));
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get total pages
    const totalPages = Math.ceil((count || 0) / limit);

    return new Response(
      JSON.stringify({
        products: data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
