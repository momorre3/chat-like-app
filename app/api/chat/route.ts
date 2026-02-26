import OpenAI from "openai";
import { createClient } from "../../../lib/supabase/server";

export async function POST(req: Request) {
  try {
    // ✅ Supabaseログイン必須
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const result = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    const text = result.output_text ?? "";

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message ?? "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}