const { aiEngine } = require('@/lib/ai/aiEngine');
module.exports = {
  id: 'feat0007',
  name: 'PDF Summarizer',
  description: 'Upload PDF text and get concise summary and action points.',
  creator: 'Akin S. Sokpah',
  run: async function(input) {
    // input.text is raw extracted text from a PDF (client should strip images)
    const text = input?.text || '';
    const prompt = "Summarize the following text into a 6-bullet summary and 3 action items:\\n\\n" + text;
    const resp = await aiEngine({ model: 'deepseek', prompt, system: 'Summarize and extract actions' });
    return { ok: true, summary: resp };
  }
};
