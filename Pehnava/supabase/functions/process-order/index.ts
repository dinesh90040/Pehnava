import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { orderData, cartItems } = await req.json();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: "pending",
        subtotal: orderData.subtotal,
        tax_amount: orderData.taxAmount || 0,
        shipping_amount: orderData.shippingAmount || 0,
        discount_amount: orderData.discountAmount || 0,
        total_amount: orderData.totalAmount,
        shipping_address: orderData.shippingAddress,
        billing_address: orderData.billingAddress,
        notes: orderData.notes,
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabaseClient
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

    // Update inventory
    for (const item of cartItems) {
      const { error: inventoryError } = await supabaseClient
        .from("inventory")
        .update({
          quantity_available: item.stock_quantity - item.quantity,
          quantity_reserved: item.stock_quantity - item.quantity,
        })
        .eq("variant_id", item.variant_id);

      if (inventoryError) {
        throw inventoryError;
      }
    }

    // Clear user's cart
    const { error: cartError } = await supabaseClient
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (cartError) {
      throw cartError;
    }

    // Create notification
    await supabaseClient.from("notifications").insert({
      user_id: user.id,
      title: "Order Confirmed",
      message: `Your order ${orderNumber} has been confirmed and is being processed.`,
      type: "order",
      action_url: `/account/orders/${order.id}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        order: order,
        orderNumber: orderNumber,
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
