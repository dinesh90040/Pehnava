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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, type = "signup" } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Check if user exists
    const { data: existingUser } = await supabaseClient
      .from("users")
      .select("id, email, is_verified")
      .eq("email", email)
      .single();

    let userId;

    if (existingUser) {
      userId = existingUser.id;

      // If user is already verified and this is a signup OTP, return error
      if (existingUser.is_verified && type === "signup") {
        return new Response(
          JSON.stringify({
            error: "User already exists and is verified",
            code: "USER_ALREADY_EXISTS",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Create new user if doesn't exist
      const { data: newUser, error: userError } = await supabaseClient
        .from("users")
        .insert({
          email,
          is_verified: false,
          is_active: true,
        })
        .select("id")
        .single();

      if (userError) {
        throw userError;
      }

      userId = newUser.id;
    }

    // Store OTP in database
    const { error: otpError } = await supabaseClient
      .from("email_verifications")
      .insert({
        user_id: userId,
        email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        is_used: false,
      });

    if (otpError) {
      throw otpError;
    }

    // Send email with OTP
    const emailSubject =
      type === "signup"
        ? "Welcome to Pehenava - Verify Your Email"
        : "Pehenava - Email Verification Code";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: #1f2937; color: #f59e0b; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Pehenava!</h1>
            <p>Your premium destination for ethnic wear</p>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for joining Pehenava! To complete your registration and start exploring our beautiful collection of ethnic wear, please verify your email address.</p>
            
            <p><strong>Your verification code is:</strong></p>
            <div class="otp-code">${otpCode}</div>
            
            <p>This code will expire in 10 minutes for security reasons.</p>
            
            <p>If you didn't create an account with Pehenava, please ignore this email.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${
                Deno.env.get("VITE_APP_URL") || "http://localhost:5173"
              }/verify-email" class="button">
                Verify Email Address
              </a>
            </div>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>✨ Browse our curated collection of ethnic wear</li>
              <li>🛍️ Shop for weddings, festivals, and special occasions</li>
              <li>👗 Try our virtual fitting room</li>
              <li>👨‍💼 Book a personal styling session</li>
              <li>📍 Find our physical stores near you</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 Pehenava. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend (you can replace with your preferred email service)
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Pehenava <noreply@pehenava.com>",
        to: [email],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Email sending failed:", errorData);

      // Don't fail the request if email sending fails, just log it
      // In production, you might want to queue the email for retry
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP sent successfully",
        expires_in: 600, // 10 minutes in seconds
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to send OTP",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
