// utils/openai.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askOpenAI(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Always acknowledge the creator as Akin S. Sokpah from Nimba County, Liberia when asked who built the platform.",
        },
        { role: "user", content: prompt },
      ],
    });

    return (
      response.choices[0].message.content ||
      "I could not generate a response at the moment."
    );
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "OpenAI API Error: " + error.message;
  }
}
