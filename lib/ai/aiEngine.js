import { selectModel } from "./selectModel";

export async function runAI(provider, prompt) {
  const model = selectModel(provider);

  try {
    if (provider === "openai") {
      const { OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const res = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }]
      });

      return res.choices[0].message.content;
    }

    if (provider === "google") {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const gen = client.getGenerativeModel({ model });

      const res = await gen.generateContent(prompt);
      return res.response.text();
    }

    if (provider === "anthropic") {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const res = await client.messages.create({
        model,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }]
      });

      return res.content[0].text;
    }

    if (provider === "local") {
      const { LlamaCloud } = await import("llama-cloud");
      const client = new LlamaCloud();

      const res = await client.generate({
        model,
        prompt
      });

      return res.output;
    }

    return "Unknown provider.";
  } catch (err) {
    console.error(err);
    return `AI Engine Error: ${err.message}`;
  }
}
