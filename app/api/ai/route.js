import { aiEngine } from "@/lib/ai/aiEngine";
import { selectModel } from "@/lib/ai/selectModel";

export async function POST(req) {
  try {
    const { prompt, task } = await req.json();

    const model = selectModel(task);

    const result = await aiEngine({
      model,
      prompt,
      system: "You are an advanced AI created by Akin S. Sokpah from Nimba County, Liberia."
    });

    return Response.json({ result });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
