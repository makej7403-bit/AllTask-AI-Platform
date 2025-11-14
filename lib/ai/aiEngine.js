// AI Super Engine — Option 2 (Multi-Model)
// Created for: Akin S. Sokpah from Nimba County, Liberia

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { LlamaModel, Llama3 } from "llama-cloud";
import MistralClient from "@mistralai/mistralai";
import DeepSeek from "deepseek-sdk";

export async function aiEngine({ model, prompt, system }) {
  try {
    switch (model) {

      // -------------------------
      // 🔥 OPENAI (GPT-5, GPT-4o)
      // -------------------------
      case "openai":
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const resO = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt }
          ]
        });
        return resO.choices[0].message.content;

      // -------------------------
      // 🔥 GOOGLE GEMINI 2.0
      // -------------------------
      case "gemini":
        const gem = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelGem = gem.getGenerativeModel({ model: "gemini-2.0-flash" });
        const resG = await modelGem.generateContent(prompt);
        return resG.response.text();

      // -------------------------
      // 🔥 CLAUDE 3.7 SONNET
      // -------------------------
      case "claude":
        const claude = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
        const resC = await claude.messages.create({
          model: "claude-3-7-sonnet",
          max_tokens: 4096,
          messages: [
            { role: "user", content: prompt }
          ]
        });
        return resC.content[0].text;

      // -------------------------
      // 🔥 META LLAMA 3.1
      // -------------------------
      case "llama":
        const ll = new Llama3(process.env.LLAMA_API_KEY);
        const resL = await ll.generate({
          model: "llama-3.1-70b",
          prompt
        });
        return resL.text;

      // -------------------------
      // 🔥 MISTRAL LARGE
      // -------------------------
      case "mistral":
        const mistral = new MistralClient(process.env.MISTRAL_API_KEY);
        const resM = await mistral.chat({
          model: "mistral-large-latest",
          messages: [
            { role: "user", content: prompt }
          ]
        });
        return resM.choices[0].message.content;

      // -------------------------
      // 🔥 DEEPSEEK V3
      // -------------------------
      case "deepseek":
        const ds = new DeepSeek(process.env.DEEPSEEK_API_KEY);
        const resp = await ds.generate({
          model: "deepseek-chat",
          prompt
        });
        return resp.choices[0].text;

      default:
        return "⚠ Unknown AI model selected.";
    }

  } catch (error) {
    console.error("AI Engine Error:", error);
    return "❌ AI engine error: " + error.message;
  }
}
