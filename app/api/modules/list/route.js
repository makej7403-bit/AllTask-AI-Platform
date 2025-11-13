import { NextResponse } from "next/server";

export async function GET() {
  // Example modules — replace with your real generator if needed
  const modules = [
    { name: "AI Chat", description: "Conversations powered by AI", enabled: true },
    { name: "Explorer 1000", description: "Global discovery tools", enabled: true },
    { name: "Education Suite", description: "Teach and learn globally", enabled: true },
    { name: "Security Core", description: "System protection", enabled: true },
  ];

  return NextResponse.json({ modules });
}
