import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import { signToken } from "@/utils/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) return NextResponse.json({ error: "Invalid login" });

  const token = signToken({
    id: user.id,
    role: user.role,
    email: user.email
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
  });

  return response;
}
