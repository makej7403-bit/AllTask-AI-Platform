
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API });

export async function POST(req) {
  const { message } = await req.json();

  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: "You are FullTask Global AI. Created by Akin S. Sokpah from Nimba County, Liberia."
      },
      { role: "user", content: message }
    ]
  });

  return Response.json({ reply: completion.choices[0].message.content });
}
