export function selectModel(task) {
  if (!task) return "openai";

  const mapping = {
    "coding": "claude",
    "vision": "gemini",
    "bible": "openai",
    "medical": "claude",
    "education": "openai",
    "business": "openai",
    "music": "mistral",
    "image": "gemini",
    "video": "gemini",
    "research": "deepseek",
    "creative": "mistral"
  };

  return mapping[task] || "openai";
}
